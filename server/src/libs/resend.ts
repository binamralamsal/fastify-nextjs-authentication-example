import { Resend } from "resend";

import { env } from "@/configs/env";

export const resend = new Resend(env.RESEND_API_KEY);
