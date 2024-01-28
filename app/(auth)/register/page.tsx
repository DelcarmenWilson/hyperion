import { RegisterForm } from "@/components/auth/register-form";
import { db } from "@/lib/db";

const RegisterPage = async () => {
  const teams = await db.team.findMany();

  return <RegisterForm teams={teams} />;
};

export default RegisterPage;
