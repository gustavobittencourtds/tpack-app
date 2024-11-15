// src/types/nodemailer.d.ts
declare module 'nodemailer' {
  interface TransportOptions {
    service?: string;
    auth: {
      user: string;
      pass: string;
    };
  }

  interface MailOptions {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
  }

  interface SentMessageInfo {
    messageId: string;
  }

  interface Transporter {
    sendMail(mailOptions: MailOptions): Promise<SentMessageInfo>;
  }

  function createTransport(options: TransportOptions): Transporter;

  export { createTransport, TransportOptions, MailOptions, SentMessageInfo };
}
