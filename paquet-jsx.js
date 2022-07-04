const babel = require("@babel/core");

class PaquetJsx {
  constructor() {
    this.before = this.parseJsx;
    this.after = (code) => code;

    this.before = this.before.bind(this);
    this.after = this.after.bind(this);
    this.parseJsx = this.parseJsx.bind(this);
  }

  reduceJSXExpression(expression, t) {
    const { type } = expression;

    if (type === "ConditionalExpression") {
      const { test, consequent, alternate } = expression;

      return t.callExpression(t.identifier("__jsx"), [
        t.conditionalExpression(test, consequent, alternate),
      ]);
    } else if (type === "Identifier") {
      return t.callExpression(t.identifier("__jsx"), [
        t.identifier(expression.name),
      ]);
    }
  }

  reduceJSXElement(node, t) {
    const { openingElement, closingElement } = node;
    const { name } = openingElement.name;
    const { attributes } = openingElement;
    const { children } = node;

    return t.callExpression(t.identifier("__jsx"), [
        t.stringLiteral(name),
        t.objectExpression(
          attributes.map((attribute) => {
            const { name, value } = attribute;
            return t.objectProperty(t.stringLiteral(name.name), value);
          })
        ),
        t.arrayExpression(
          children
            .map((child) => {
              if (child.type === "JSXText") {
                return t.stringLiteral(child.value);
              } else if (child.type === "JSXElement") {
                const reducedChild = this.reduceJSXElement(child, t);
                return reducedChild;
              } else if (child.type === "JSXExpressionContainer") {
                return this.reduceJSXExpression(child.expression, t);
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

    const __jsx = `(tag, attrs, children) => {
      const node = {};
      if (tag) {
        node.tag = tag;
        node.type = "Element",
        node.attrs = attrs;
        node.children = children;
      } else {
        node.type = "Text";
      }

      return node;
    }`

    return `
      const __jsx = ${__jsx}
      ${newCode.code}
    `;
  }
}

module.exports = PaquetJsx;
