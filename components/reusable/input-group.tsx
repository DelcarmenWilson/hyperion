type BoxProps = {
  title: string;
  value: string;
};

export const TextGroup = ({ title, value }: BoxProps) => {
  return (
    <p>
      {title}:
      {value ? (
        <span> {value}</span>
      ) : (
        <span className="text-primary"> Not set</span>
      )}
    </p>
  );
};
