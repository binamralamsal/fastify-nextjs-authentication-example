import type { CreateEmailResponseSuccess, ErrorResponse } from "resend";

import { resend } from "@/libs/resend";

export interface CreateEmailResponse {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
}

export async function sendEmail(
  data: {
    to: string | string[];
    subject: string;
  } & ({ react: JSX.Element } | { html: string } | { text: string }),
): Promise<CreateEmailResponse> {
  return resend.emails.send({
    ...data,
    from: "Auth Sample <binamralamsal@resend.dev>",
  });
}
