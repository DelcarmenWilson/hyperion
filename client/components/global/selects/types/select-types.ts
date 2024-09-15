export type SelectType= {
    defaultValue: string;
    onValueChange: React.Dispatch<React.SetStateAction<string | undefined>>;
    disabled?: boolean;
  };
