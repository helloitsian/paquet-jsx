const NestedComponent = () => {
  return <div>This is the nested component</div>
}

const Component = () => {
  return <div>
    <NestedComponent id="1" />
    <NestedComponent id="2" />
    <NestedComponent id="3" />
  </div>
}

console.log((<Component/>).type());