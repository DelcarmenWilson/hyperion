import { RegisterForm } from "@/components/auth/forms/register-form";
import { teamsGetAll } from "@/actions/team";

const RegisterPage = async () => {
  const teams = await teamsGetAll();

  return <RegisterForm teams={teams} />;
};

export default RegisterPage;
