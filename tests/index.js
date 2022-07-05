const fs = require("fs");
const path = require("path");
const PaquetJsx = require("../paquet-jsx.js");

const plugin = new PaquetJsx();

const tests = [
  // { title: "Simple Test", path: "./simple.test.js" },
  // { title: "Conditional Test", path: "./conditional.test.js" },
   { title: "Expression Test", path: "./expression.test.js" },
  //{ title: "Nested Components", path: "./nested-component.test.js" },
  //{ title: "Props Test", path: "./props.test.js" },
];

tests.forEach((test) => {
  console.log(`::: ${test.title} :::`);
  
  const code = fs.readFileSync(path.resolve(path.join(__dirname, test.path)), "utf8");
  console.log("::: Base Code :::");
  console.log(code);

  const transformedCode = plugin.after(plugin.before(code));
  console.log("::: Transformed Code :::");
  console.log(transformedCode);
})