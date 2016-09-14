'use strict';
var postcss  = require('postcss');
var parser   = require('postcss-value-parser');
var fs       = require('fs');
var beautify = require('js-beautify');

// List of jQuery Selectors
var jquerySelectors = {
    this: '$(this)',
    next: '$(this).next(%)',
    prev: '$(this).prev(%)',
    parent: '$(this).parent(%)',
    children: '$(this).children(%)',
    closest: '$(this).closest(%)',
    siblings: '$(this).siblings(%)',
    find: '$(this).find(%)'
};

/**
 * Convert string to camel case
 * @param  {string} str
 * @return {string}     returns camel case string
 */
function toCamelCase(str) {
    return str.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
    });
}

function attributeEquals(selector) {
    var newSelector = selector.match(/\[([^)]+)\]/)[1].replace(/["']/g, '');
    return newSelector;
}

function firstPart(selector) {
    return selector.match(/(.*)\[(.*)\]/)[1].replace('/\[(.*)\]/', '');
}

/**
 * Create a jquery selector
 * @param  {string} selector target or element selector
 * @return {string}          returns selector form
 */
function selectorForm(selector) {
    var str;
    if (selector.indexOf('[') !== -1) {
        var newSelector = attributeEquals(selector);
        newSelector = newSelector.replace('sel=', ''); // valid sass syntax
        var firstSelector = firstPart(selector);
        if (firstSelector in jquerySelectors) {
            str = jquerySelectors[firstSelector]
                  .replace('%', '"' + newSelector + '"');
        }
    } else
    if (selector in jquerySelectors) {
        str = jquerySelectors[selector].replace('%', '');
    } else {
        str = '$("' + selector + '")';
    }
    return str;
}

function createClick(element, lines) {
    var clickFunction = '.on("click", '; // or '.click( '

    var str = selectorForm(element) + clickFunction +
              'function () {' + '\n' + lines + '});\n\n';
    return str;
}

module.exports = postcss.plugin('postcss-click', function (opts) {
    return function (css, result) {
        opts = opts || {};

        var AT_RULE_NAME = 'action';

        var beutifyDefault = {
            indent_size: 2,
            indent_char: ' ',
            end_with_newline: true,
            break_chained_methods: false
        };

        var outputFile = 'output' in opts ? opts.output : 'click.js';
        var append = 'append' in opts ? opts.append : false;
        var beutifyOpts = 'beautify' in opts ? opts.beautify : beutifyDefault;

        var elements = [];
        var clickFlag = false;
        var codeWrapperBegin = '$(function() {\n\n';
        var codeWrapperEnd = '});';
        var content = '/*! Generated with PostCSS Click */\n\n' +
                      codeWrapperBegin;

        css.walkRules(function (rule) {
            var selector = rule.selector;

            if (selector.indexOf(':click') !== -1) {
                clickFlag = true;

                // look for multiple selectors in rule
                if (selector.split(',').length > 1) {
                    throw rule.error('Multiple Selectors is not supported.');
                }

                var selectors = selector.split(':click');
                var element = selectors[0].trim();
                var target = selectors[1].trim();

                if (element === undefined) {
                    throw rule.error('Invalid syntax.');
                }

                elements.push(element); // for cursor: pointer

                if (target === '' || target === undefined) {
                    target = 'this';
                }

                // css decls use .css() method
                var cssDeclsChain = [];
                var cssMethodStr = '';
                rule.walkDecls(function (decl) {
                    cssDeclsChain.push('"' + decl.prop + '": "' +
                                              decl.value + '"');
                });

                if (cssDeclsChain.length > 0) {
                    cssDeclsChain.join(', ');
                    cssMethodStr = '{ ' + cssDeclsChain + ' }';
                }

                var lines = '';
                var concatFunc = '';

                if (cssMethodStr !== '') {
                    concatFunc += '.' + 'css' + '(' + cssMethodStr + ')';
                }

                // atRules as methods
                rule.walkAtRules(function (atRule) {
                    var methodValue,
                        methodName;

                    if (atRule.name === AT_RULE_NAME) {
                        var str = parser(atRule.params);
                        str.walk(function (node) {
                            if (node.type === 'function') {
                                methodName = node.value;

                                // NOTE: assume that only have 1 parameter
                                if (node.nodes.length > 0) {
                                    if (node.nodes[0].type === 'string') {
                                        methodValue = '"' +
                                                      node.nodes[0].value +
                                                      '"';
                                    } else {
                                        methodValue = node.nodes[0].value;
                                    }
                                } else {
                                    methodValue = '';
                                }

                                concatFunc += '.' + toCamelCase(methodName) +
                                              '(' + methodValue + ')';
                            }
                        });
                    }

                });

                lines += selectorForm(target) + concatFunc + ';\n';
                content += createClick(element, lines);
                rule.remove();
            }
        });

        if (clickFlag) {
            var jsCode = beautify(content + codeWrapperEnd, beutifyOpts);

            if (append === true) {
                var p1 = new Promise(function (resolve, reject) {
                    fs.appendFile(outputFile, jsCode, function (err) {
                        if ( err ) return reject(err);
                        resolve();
                    });
                });

                return p1.then(function () {
                    return result;
                });
            } else {
                var p2 = new Promise(function (resolve, reject) {
                    fs.writeFile(outputFile, jsCode, function (err) {
                        if ( err ) return reject(err);
                        resolve();
                    });
                });

                return p2.then(function () {
                    return result;
                });
            }
        }
    };
});
