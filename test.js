const assert = require('assert');
const jfTpl  = require('./index');
function testTpl(config, expected)
{
    assert.equal(jfTpl(config), expected.tpl);
    if (expected.context)
    {
        assert.deepEqual(config.context, expected.context);
    }
    if (expected.defaults)
    {
        assert.deepEqual(config.defaults, expected.defaults);
    }
}
const context  = {
    name : 'Guest',
    site : 'home'
};
const defaults = {
    name  : 'User',
    osite : 'university'
};
//------------------------------------------------------------------------------
// Verificamos que no se modifiquen los valores por defecto.
//------------------------------------------------------------------------------
testTpl(
    {
        tpl : 'Hello {name}, welcome to {site}',
        context
    },
    {
        tpl     : 'Hello Guest, welcome to home',
        context : Object.assign({}, context)
    }
);
//------------------------------------------------------------------------------
// Verificamos el uso de left y right usando caracteres usados en RegExp.
// Verificamos que no se modifiquen ni el contexto ni los valores por defecto.
//------------------------------------------------------------------------------
[['<[', ']>'], ['{{', '}}'], ['{{{', '}}}'], ['[', ']'], ['[[', ']]'], ['[[[', ']]]'], ['/', '*']].forEach(
    delims => testTpl(
        {
            tpl   : `Hello ${delims[0]}name${delims[1]}, welcome to ${delims[0]}osite${delims[1]}`,
            left  : delims[0],
            right : delims[1],
            context,
            defaults
        },
        {
            tpl      : 'Hello Guest, welcome to university',
            context  : Object.assign({}, context),
            defaults : Object.assign({}, defaults)
        }
    )
);
//------------------------------------------------------------------------------
// Verificamos el uso de left y right.
// Verificamos el uso de delKeys, modificando tanto el contexto como los valores
// por defecto dependiendo de quién aporte el valor.
//------------------------------------------------------------------------------
testTpl(
    {
        tpl     : 'Hello {name} {name}, welcome to {osite}',
        delKeys : true,
        context,
        defaults
    },
    {
        tpl      : 'Hello Guest Guest, welcome to university',
        context  : {site : 'home'},
        defaults : {name : 'User'}
    }
);
//------------------------------------------------------------------------------
// Verificamos el uso de keep.
//------------------------------------------------------------------------------
testTpl(
    {
        tpl     : 'Hello {name}, welcome to {osite}',
        keep    : true,
        context : {
            name : 'User'
        }
    },
    {
        tpl      : 'Hello User, welcome to {osite}',
        context  : {
            name : 'User'
        }
    }
);
