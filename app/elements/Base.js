/**
 *
 */
var Node = require('blessed/lib/widgets/node');
var Element = require('blessed/lib/widgets/element');

const Make = (type, prototype = {}) => {
    class CustomElement {
        constructor(options) {
            if (!(this instanceof Node)) {
                return new CustomElement(options);
            }
            options = options || {};
            Element.call(this, options);
        }
    }
    /**
     * Modules
     */
    CustomElement.prototype.__proto__ = Element.prototype;
    CustomElement.prototype.type = type;
    CustomElement.prototype = Object.assign(CustomElement.prototype, prototype);
    return (options) => new CustomElement(options);
};
/**
 * Expose
 */

module.exports = Make;
