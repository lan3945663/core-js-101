/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = function getArea() {
    return this.width * this.height;
  };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CssSelectorBuilder {
  constructor() {
    this.sel = '';
    this.sid = '';
    this.sclass = '';
    this.sattr = '';
    this.spseudoClass = '';
    this.spseudoElement = '';

    this.scombied = '';
    this.els = [];
  }

  validate() {
    throw new Error(
      'Element, id and pseudo-element should not occur more then one time inside the selector',
    );
  }

  validateOrder() {
    throw new Error(
      'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',
    );
  }

  element(value) {
    if (this.sel !== '') {
      this.validate();
    }

    if (this.els.includes('id' || 'class' || 'attr' || 'pseudoClass' || 'pseudoElement')) {
      this.validateOrder();
    }

    this.els.push(this.element.name);

    this.sel = value;

    return this;
  }

  id(value) {
    if (this.sid !== '') {
      this.validate();
    }

    if (
      this.els.includes('class')
    || this.els.includes('attr')
    || this.els.includes('pseudoClass')
    || this.els.includes('pseudoElement')) {
      this.validateOrder();
    }


    this.els.push(this.id.name);
    this.sid = `#${value}`;

    return this;
  }

  class(value) {
    if (this.els.includes('attr' || 'pseudoClass' || 'pseudoElement')) {
      this.validateOrder();
    }

    this.els.push(this.class.name);


    this.sclass = `${this.sclass}.${value}`;
    return this;
  }

  attr(value) {
    if (
      this.els.includes('pseudoClass' || 'pseudoElement')) {
      this.validateOrder();
    }

    this.els.push(this.attr.name);

    this.sattr = `[${value}]`;
    return this;
  }

  pseudoClass(value) {
    if (this.els.includes(this.pseudoElement.name)) {
      this.validateOrder();
    }

    this.els.push(this.pseudoClass.name);

    this.spseudoClass = `${this.spseudoClass}:${value}`;
    return this;
  }

  pseudoElement(value) {
    if (this.spseudoElement !== '') {
      this.validate();
    }

    this.els.push(this.pseudoElement.name);

    this.spseudoElement = `::${value}`;
    return this;
  }

  combine(selector1, combinator, selector2) {
    this.scombied = `${selector1.stringify()} ${combinator} ${selector2.stringify()}`;
    return this;
  }

  stringify() {
    /* console.log(`${this.sel}${this.sid}${this.sclass}${this.sattr}
    ${this.spseudoClass}${this.spseudoElement}${this.scombied}`); */
    return `${this.sel}${this.sid}${this.sclass}${this.sattr}${this.spseudoClass}${this.spseudoElement}${this.scombied}`;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelectorBuilder().element(value);
  },

  id(value) {
    return new CssSelectorBuilder().id(value);
  },

  class(value) {
    return new CssSelectorBuilder().class(value);
  },

  attr(value) {
    return new CssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new CssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelectorBuilder().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return new CssSelectorBuilder().combine(selector1, combinator, selector2);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
