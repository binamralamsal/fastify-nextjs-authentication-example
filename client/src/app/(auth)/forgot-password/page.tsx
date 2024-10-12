import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-5 bg-gray-100">
      <ForgotPasswordForm />
    </div>
  );
}
