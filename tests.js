#!/usr/bin/env node
const assert = require('assert');
const jfTpl  = require('./index');

function testTpl(config, expected)
{
    assert.equal(jfTpl(config), expected.tpl);
    if (expected.context)
    {
        assert.deepStrictEqual(config.context, expected.context);
    }
    if (expected.defaults)
    {
        assert.deepStrictEqual(config.defaults, expected.defaults);
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
// Verificamos que si no hay plantilla no falle.
//------------------------------------------------------------------------------
testTpl({ tpl : '' }, { tpl : '' });
//------------------------------------------------------------------------------
// Verificamos que si no hay contexto no falle.
//------------------------------------------------------------------------------
testTpl(
    {
        tpl : 'Hello {name}, welcome to {site}'
    },
    {
        tpl : 'Hello , welcome to '
    }
);
testTpl(
    {
        tpl  : 'Hello {name}, welcome to {site}',
        keep : true
    },
    {
        tpl : 'Hello {name}, welcome to {site}'
    }
);
//------------------------------------------------------------------------------
// Verificamos que no se modifiquen los valores por defecto.
//------------------------------------------------------------------------------
testTpl(
    {
        context,
        tpl : 'Hello {name}, welcome to {site}'
    },
    {
        context,
        tpl : 'Hello Guest, welcome to home'
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
        context  : { site : 'home' },
        defaults : { name : 'User' }
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
        tpl     : 'Hello User, welcome to {osite}',
        context : {
            name : 'User'
        }
    }
);
//------------------------------------------------------------------------------
// Verificamos que si un valor es null o undefined no se reemplace.
//------------------------------------------------------------------------------
testTpl(
    {
        context : {
            name : undefined,
            site : null
        },
        tpl     : 'Hello {name}, welcome to {site}',
        keep    : true
    },
    {
        tpl : 'Hello {name}, welcome to {site}'
    }
);
testTpl(
    {
        context : {
            name : undefined,
            site : null
        },
        tpl     : 'Hello {name}, welcome to {site}'
    },
    {
        tpl : 'Hello , welcome to '
    }
);
//------------------------------------------------------------------------------
// Verificamos el uso de un array como contexto.
//------------------------------------------------------------------------------
testTpl(
    {
        context : ['Abcdef', 'Xyz'],
        tpl     : 'Hello {0}, welcome to {1}'
    },
    {
        context : ['Abcdef', 'Xyz'],
        tpl : 'Hello Abcdef, welcome to Xyz'
    }
);
testTpl(
    {
        context : ['Abcdef', 'Xyz'],
        tpl     : 'Hello {0}, welcome to {1} {2}',
        delKeys : true
    },
    {
        tpl     : 'Hello Abcdef, welcome to Xyz '
    }
);
testTpl(
    {
        defaults : ['Abcdef', 'Xyz'],
        tpl      : 'Hello {0}, welcome to {1}',
        delKeys  : true
    },
    {
        tpl : 'Hello Abcdef, welcome to Xyz'
    }
);
