import postcss from 'postcss';
import fs      from 'fs';
import test    from 'ava';

import plugin  from './';

function run(t, input, output, expectJS, opts = { }) {
    return postcss([ plugin(opts) ]).process(input)
        .then( result => {
            var outputJS = fs.readFileSync(opts.output, 'utf8');
            t.same(result.css, output); // check css
            t.same(outputJS, expectJS); // check js
            t.same(result.warnings().length, 0);
            if (opts.append) {
                fs.writeFileSync('test/append.js',
                                 '// This file is not empty\n');
            }
        });
}

test('test with append true', t => {
    var inputCSS = fs.readFileSync('test/style.css', 'utf8');
    var expectCSS = fs.readFileSync('test/style.expect.css', 'utf8');
    var expectJS = fs.readFileSync('test/append.expect.js', 'utf8');

    return run(t, inputCSS, expectCSS, expectJS, {
        output: 'test/append.js',
        append: true
    });
});

test('test all togheter', t => {
    var inputCSS = fs.readFileSync('test/style.css', 'utf8');
    var expectCSS = fs.readFileSync('test/style.expect.css', 'utf8');
    var expectJS = fs.readFileSync('test/click.expect.js', 'utf8');

    return run(t, inputCSS, expectCSS, expectJS, {
        output: 'test/click.js'
    });
});
