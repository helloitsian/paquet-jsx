const ExpressionTest = () => {
  const message = "hello";
  const func = (msg) => msg + " world";
  const condition = true;
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
      <div>
        {"another message"}
      </div>
      <div>
        {func(message)}
      </div>
      <div>
        {condition ? "true" : "false"}
      </div>
    </div>
  );
}

console.log(<ExpressionTest/>)