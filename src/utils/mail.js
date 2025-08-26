import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manger",
      link: "htttps://taskmanagelink.com",
    },
  });

  const emailTextul = mailGenerator.generatePlaintext(options.mailgenContent);

  const emailHTML = mailGenerator.generate(options.mailgenContent);

  const transpoter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager@emaple.com",
    to: options.email,
    subject: options.subject,
    text: emailTextul,
    html: emailHTML,
  };

  try {
    await transpoter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed siliently. Make sure that you have provided your MAILTRAP credentials in the .env files",
    );
    console.error("ERROR: ", error);
  }
};

// Email Verification Mail
const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! We're excited to have you on board.",
      action: {
        instructions: "To verify your email, please click the button below:",
        button: {
          color: "#e84123ff",
          text: "Verify your email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// Forgot Password Mail
const forgotPasswordMailgenContent = (username, resetUrl) => {
  return {
    body: {
      name: username,
      intro:
        "We received a request to reset your password. Don’t worry, you can set a new one easily.",
      action: {
        instructions: "Click the button below to reset your password:",
        button: {
          color: "#32f4a6ff",
          text: "Reset your password",
          link: resetUrl,
        },
      },
      outro:
        "If you didn’t request a password reset, you can safely ignore this email.",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
