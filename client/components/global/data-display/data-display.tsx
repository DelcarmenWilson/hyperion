type Props = {
  title: string;
  value: string;
};
export const DataDisplay = ({ title, value }: Props) => {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      <span className="text-xs text-foreground font-semibold pl-3">
        {value}
      </span>
    </div>
  );
};

export const DataDisplayItalic = ({ title, value }: Props) => {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{title}</p>
      <span className="text-xs text-foreground font-semibold pl-3 italic">
        {value}
      </span>
    </div>
  );
};

export const DataDisplayBox = ({ title, value }: Props) => {
  return (
    <div className="border border-separate p-2">
      <p className="text-xs text-muted-foreground">{title}</p>
      <span className="text-foreground font-semibold pl-3 break-words">
        {value}
      </span>
    </div>
  );
};
