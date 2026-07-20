import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (!resend) {
    console.warn(`[email] RESEND_API_KEY not set, skipping email "${subject}" to ${to}`);
    return;
  }

  const from = process.env.EMAIL_FROM || "orders@resend.dev";

  try {
    await resend.emails.send({ from, to, subject, html });
  } catch (err) {
    console.error("[email] failed to send", err);
  }
}
