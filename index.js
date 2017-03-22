const escRegExp = /[-\/\\^$*+?.()|[\]{}]/g;
const escape    = (text) => text && typeof text === 'string'
    ? text.replace(escRegExp, '\\$&')
    : '';
/**
 * Reemplaza los parámetros presentes en una plantilla con los valores
 * especificados en el contexto.
 *
 * @param {Object}  config          Configuración a usar para renderizar el texto.
 * @param {Object}  config.context  Contexto del cual se obtendrán las variables presentes en la plantilla.
 * @param {Object}  config.defaults Valores por defecto del contexto.
 * @param {Boolean} config.delKeys  Si es `true` se eliminan del contexto los parámetros reemplazados.
 * @param {String}  config.left     Delimitador izquierdo (`{` por defecto).
 * @param {String}  config.right    Delimitador derecho (`}` por defecto).
 * @param {String}  config.tpl      Plantilla a renderizar.
 */
module.exports = function jfTpl(config)
{
    const _context  = config.context || {};
    const _defaults = config.defaults || {};
    const _delKeys  = config.delKeys;
    const _left     = escape(config.left || '{');
    const _right    = escape(config.right || '}');
    const _removed  = {};
    const _values   = Object.assign({}, _defaults, _context);
    return String(config.tpl || '').replace(
        new RegExp(`${_left}([^${_left}${_right}]+)${_right}`, 'g'),
        (pattern, match) =>
        {
            let _result = '';
            match       = match.trim();
            if (match in _values)
            {
                const _value = _values[match];
                if (_value !== undefined && _value !== null)
                {
                    _result = _value;
                }
                if (_delKeys && !(match in _removed))
                {
                    _removed[match] = 1;
                    if (match in _context)
                    {
                        delete _context[match];
                    }
                    else if (match in _defaults)
                    {
                        delete _defaults[match];
                    }
                }
            }
            return _result;
        }
    );
};
