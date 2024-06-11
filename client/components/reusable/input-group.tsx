type InputGroupProps = {
  title: string;
  value: string;
};

export const InputGroup = ({ title, value }: InputGroupProps) => {
  return (
    <p>
      {title}:
      {value ? (
        <span className="font-bold"> {value}</span>
      ) : (
        <span className="text-primary"> Not set</span>
      )}
    </p>
  );
};
