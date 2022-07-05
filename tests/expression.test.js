const ExpressionTest = () => {
  const message = "hello";
  const func = (msg) => msg + " world";
  const condition = true;
  return (
    <div>
      <div>
        {(() => "message")()}
      </div>
      <div>
        {"message"}
      </div>
      <div>
        {2 + 2}
      </div>
    </div>
  );
}

console.log(<ExpressionTest/>)