const Component = () => {

  const handleClick = () => {
    alert("Clicked!");
  }

  return (
    <button onClick={handleClick}>
      Click Me!
    </button>
  )
}