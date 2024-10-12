import { LoginForm } from "@/features/auth/components/login-form";
import { redirectIfAuthorized } from "@/features/auth/use-cases/redirect-if-authorized";

export default async function LoginPage() {
  await redirectIfAuthorized();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <LoginForm />
    </div>
  );
}
