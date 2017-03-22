# jfTpl [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A very simple system to replace placeholders in a string with values in object.

Sometime we need replace placeholders in translated strings but other alternatives
(mustache, handlebars, underscore, etc) are too big for our requirements.

Placeholders delimiters are customizables (default: `{}`).

## Usage

[![npm install jfTpl](https://nodei.co/npm/jf-tpl.png?compact=true)](https://npmjs.org/package/jf-tpl/)

### Options

* **context**  Context with variables to replace in template.
* **defaults** Default values for context.
* **delKeys**  If `true`, all keys found in template will be removed from context/defaults,
               depending of which object provide the key (default: `false`).
* **left**     Left delimiter (default: `{`).
* **right**    Right delimiter (default: `}`).
* **tpl**      Template to render.

### Examples

```js
// Displaying `Hello Guest, welcome to home` using 
// differents configurations.
const jfTpl = require('jf-tpl');
// Simple
console.log(
    jfTpl(
        {
            tpl     : 'Hello {name}, welcome to {site}',
            context : {
                name : 'Guest',
                site : 'home'
            }
        }
    )
);
// All options used.
console.log(
    jfTpl(
        {
            tpl      : 'Hello <[name]>, welcome to <[site]>',
            defaults : {
                site : 'home'
            },
            left     : '<[',
            right    : ']>',
            context  : {
                name : 'Guest'
            }
        }
    )
);
```
