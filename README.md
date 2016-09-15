# PostCSS Click [![Build Status][ci-img]][ci]

[PostCSS]: https://github.com/postcss/postcss
[jQuery]:  https://jquery.com/https://jquery.com/
[ci-img]:  https://travis-ci.org/ismamz/postcss-click.svg
[ci]:      https://travis-ci.org/ismamz/postcss-click


> [PostCSS] plugin that allows to use the `:click` pseudo class and implement it in JavaScript.

<p align="center">
    <img src="http://ci.memecdn.com/103/8066103.gif" alt="Magic!">
</p>

With this plugin you can define in your stylesheet the behavior of an element when it is clicked. Using the `:click` pseudo class (like `:hover`) you will get a generated JavaScript file after processing the CSS with PostCSS.

In this first stage, the JavaScript is written with jQuery. Why? Because is easier.


---

Run an example locally. [See the example branch](tree/example) (:warning: Not available yet)

---


## Example

#### CSS Input

```css
.menu a {
    color: #000;
}

.menu a:click {
    color: red;
    @action toggle-class("active");
}

.menu a:click next {
    @action show(1000);
}

.menu a:click .item {
    @action slide-toggle();
}
```

#### CSS Output
```css
.menu a {
    color: #000;
}
```

#### JavaScript Generated file

The CSS code will generate the JavaScript file with the click events and methods.

```js
$(function() {
    $(".menu a").on("click", function () {
    	$(this).css({
            "color", "red"
        }).toggleClass("active");
    });

    $(".menu a").on("click", function () {
        $(this).next().show(1000);
    });

    $(".menu a").on("click", function () {
        $('.item').slideToggle();
    });
});
```


## Rule Structure

#### Vanilla CSS

```css
element:click target {
    property: value; /* css declaration */
    @action method-name(params); /* atRule for methods */
}
```

#### Nested

You can use the following syntax with [PreCSS](https://github.com/jonathantneal/precss), Sass, Less, Stylus or just the [postcss-nested](https://github.com/postcss/postcss-nested) plugin:

```scss
element:click {
    target {
        property: value; /* css declaration */
        @action method-name(param); /* atRule for methods */
    }
}
```

### jQuery result

The result in JavaScript will be:

```js
$("element").on("click", function () {
	$("target").css({
        "property": "value"
    }).methodName(param);
});
```


## Features
- `element` can be a element tag, `id` or `class`
- `target` can be a element tag, `id` or `class` or `this` to refer to the main `element` or a [Traversing Method](https://learn.jquery.com/using-jquery-core/traversing/) like `next`, `prev`, `parent`, etc. ([See complete list of available selectors](#selectors))
- `method-name` should be written like CSS properties (hyphenated lowercase). Ex: `toggleClass` should be `toggle-class`.
- `method-name` you can use jQuery methods or jQuery plugins methods (like [Bootstrap JS Plugins](http://getbootstrap.com/javascript/)):
    - `toggle-class`
    - `add-class`
    - `remove-class`
    - `show`
    - `hide`
    - `slide-up`
    - `slide-toggle`
    - `append`
    - `html`
    - `text`
    - [`collapse`](http://getbootstrap.com/javascript/#collapse) (Bootstrap)
    - [`modal`](http://getbootstrap.com/javascript/#modals) (Bootstrap)
    - [`button`](http://getbootstrap.com/javascript/#buttons) (Bootstrap)
    - [`alert`](http://getbootstrap.com/javascript/#alerts) (Bootstrap)
    - and more!
- `params` are the parameters and values that admit the function.
    - `toggle-class` function admit a class name like `"foo"` (`string`)
    - `show` function admit the value of the duration like `300` (`int`)
    - [`button`](http://getbootstrap.com/javascript/#buttons) (Bootstrap) function admit the value `toggle` (`string`)
    - [`modal`](http://getbootstrap.com/javascript/#modals) (Bootstrap) function should be empty: `modal()`

**Note:** Multiple selectors is not supported yet.

```css
.foo:click,
.bar {
    @action toggle();
}
// => error
```

## Selectors

| CSS | jQuery |
|-----|--------|
|`this`|`$(this)` or just let `target` empty|
|`next`|`$(this).next()`|
|`prev`|`$(this).prev()`|
|`parent`|`$(this).parent()`|
|`children`|`$(this).children()`|
|`closest`|`$(this).closest()`|
|`siblings`|`$(this).siblings()`|
|`find[sel=".bar"]`|`$(this).find(".bar")`|
|`next[sel=".foo"]`|`$(this).next(".foo")`|

The list of selectors is open for suggestions.


<img align="right" width="90" height="80" src="https://camo.githubusercontent.com/2ec260a9d4d3dcc109be800af0b29a8471ad5967/687474703a2f2f706f73746373732e6769746875622e696f2f706f73746373732f6c6f676f2e737667" />

## Usage

```js
postcss([ require('postcss-click')( /* opts */ ) ])
```

See [PostCSS] docs for examples of your environment.

#### Add scripts

Off course, in your HTML file you have to include the scripts:

```html
<script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
<script src="click.js"></script>
```

## Options

### `output`

- Type: `String`
- Default: `"click.js"`

Specifies the output file destination.

### `append`

- Type: `boolean`
- Default: `false`

If you set `true` you must specify the `output` option to append at the end the JavaScript generated into your own file.

### `beautify`

- Type: `object`
- Default: `{ indent_size: 2, indent_char: ' ', end_with_newline: true, break_chained_methods: false }`

Reformat and reindent the JavaScript output file. _This object overrides the default options of js-beautify._

See [js-beautify options](https://github.com/beautify-web/js-beautify#options).


## Contributing

Help to improve code and documentation:

- If you have a problem or find an error, [create an issue](https://github.com/ismamz/postcss-click/issues/new)
- Do you want to contribute with code? [Send a pull request](https://github.com/ismamz/postcss-click/pull/new/master)


## License

MIT © [Ismael Martínez](https://github.com/ismamz)
