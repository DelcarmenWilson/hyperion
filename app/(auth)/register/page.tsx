import { RegisterForm } from "@/components/auth/forms/register-form";
import { teamsGetAll } from "@/data/team";

const RegisterPage = async () => {
  const teams = await teamsGetAll();

  return <RegisterForm teams={teams} />;
};

export default RegisterPage;
