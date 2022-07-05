const ExpressionTest = () => {
  const message = "hello";
  return (
    <div>
      <div>
        {message}
      </div>
      <div>
        {`${message}!`}
      </div>
      <div>
        {`${message + "!"}`}
      </div>
    </div>
  );
}

console.log(<ExpressionTest/>)