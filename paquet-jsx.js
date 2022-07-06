const babel = require("@babel/core");
const { isCharUppercase } = require("./util.js");

class PaquetJsx {
  constructor() {
    this.before = this.parseJsx;
    this.after = (code) => code;

    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
    this.parseJsx = this.parseJsx.bind(this);
  }

  // convert all functions to arrow functions
  reduceFunctionExpression(expression, t) {
    const {
      params,
      body,
    } = expression;

    const paramsNames = params.map((param) => param.name);
    
    return t.arrowFunctionExpression(paramsNames, body);
  }

  reduceJSXProp(attr, t) {
    const { name, value } = attr;

    let attrValue = value.expression
    return t.objectProperty(t.stringLiteral(name.name), attrValue);
  }

  reduceJSXComponent({ name, attributes, children }, t) {
    return t.callExpression(t.identifier("__jsx"), [
      t.identifier(name), 
      t.objectExpression(
        attributes.map((attribute) => {
          const { name, value } = attribute;
          if (value.type === "JSXExpressionContainer") {
            return this.reduceJSXProp(attribute, t);
          }
          return t.objectProperty(
            t.identifier(name.name),
            value ? t.stringLiteral(value.value) : t.nullLiteral()
          );
        })
      ),
      t.arrayExpression(
        children.map((child) => {
          return this.reduceJSXElement(child, t);
        })
      ),
    ]);
  }

  reduceJSXElement(node, t) {
    const { openingElement, type } = node;
    const { name } = openingElement.name;
    const { attributes } = openingElement;
    const { children } = node;

    if (isCharUppercase(name[0])) {
      return this.reduceJSXComponent({ name, attributes, children }, t);
    }

    return t.callExpression(t.identifier("__jsx"), [
      t.stringLiteral(name),
      t.objectExpression(
        attributes.map((attribute) => {
          const { name, value } = attribute;
          if (value.type === "JSXExpressionContainer") {
            return this.reduceJSXProp(attribute, t);
          }
          return t.objectProperty(t.stringLiteral(name.name), value);
        })
      ),
      t.arrayExpression(
        children.map((child) => {
          if (child.type === "JSXText") {
            return t.stringLiteral(child.value);
          } else if (child.type === "JSXElement") {
            const reducedChild = this.reduceJSXElement(child, t);
            return reducedChild;
          } else if (child.type === "JSXExpressionContainer") {
            return child.expression;
          }
        })
      ),
    ]);
  }

  transformJSXNode(path, t) {
    const { node } = path;

    const reducedNode = this.reduceJSXElement(node, t);

    path.replaceWith(t.expressionStatement(reducedNode));
  }

  parseJsx(code) {
    var self = this;
    const newCode = babel.transformSync(code, {
      plugins: [
        "@babel/plugin-syntax-jsx",
        ({ types }) => {
          return {
            visitor: {
              JSXElement: (path) => {
                self.transformJSXNode(path, types);
              },
            },
          };
        },
      ],
    });

    const __jsxText = `(text) => {
      return {
        type: "TEXT_ELEMENT",
        props: {
          nodeValue: text,
          children: [],
        },
      };
    }`

    const __jsx = `(type, props, children) => {
      return {
        type,
        props: {
          ...props,
          children: children.map(child =>
            typeof child === "object"
              ? child
              : __jsxText(child)
          ),
        },
      }
    }`;

    return `
      const __jsxText = ${__jsxText};
      const __jsx = ${__jsx};
      ${newCode.code}
    `;
  }
}

module.exports = PaquetJsx;
