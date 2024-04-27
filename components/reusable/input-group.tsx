type BoxProps = {
  title: string;
  value: string;
};

export const TextGroup = ({ title, value }: BoxProps) => {
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
