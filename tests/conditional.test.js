const ConditionalTest = () => {
  const condition = true;

  return (
    <div>
      {condition ? <div>Hello, World!</div> : null}
    </div>
  )
}