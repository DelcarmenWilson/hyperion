const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800">{children}</div>
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-background to-primary">
      {children}
    </div>
  );
};

export default AuthLayout;
