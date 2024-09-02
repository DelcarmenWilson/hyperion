type Props = {
  children: React.ReactNode;
};
export const DataContainer = ({ children }: Props) => {
  return <div className="bg-background p-4">{children}</div>;
};
