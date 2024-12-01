import { RegisterForm } from "@/components/auth/forms/register-form";
import { getTeams } from "@/actions/team";

const RegisterPage = async () => {
  const teams = await getTeams();
  return <RegisterForm teams={teams} />;
};

export default RegisterPage;
