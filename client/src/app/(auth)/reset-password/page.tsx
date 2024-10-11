import { redirect } from "next/navigation";

import ResetPassword from "./reset-password";
import { searchParamsSchema } from "./search-params-dto";

export const dynamic = "force-dynamic";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { token: string; email: string };
}) {
  const parsedSearchParams = searchParamsSchema.safeParse(searchParams);
  if (parsedSearchParams.error) return redirect("/");

  return <ResetPassword searchParams={parsedSearchParams.data} />;
}
