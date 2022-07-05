const NestedComponent = (props) => {
  console.log(props);
  return <div>{ JSON.stringify(props) }</div>
}

const Component = () => {
  return <div>
    <NestedComponent id={"1"} number={1} object={{ a: 1 }} arrowFunc={() => console.log("this is an arrow function")} func={function() { console.log("this is a function") }}/>  
  </div>
}

/* object={{ a: 1 }} */

console.log(<Component/>);