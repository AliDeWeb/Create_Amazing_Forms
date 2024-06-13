import nodeMailer from "nodemailer";

const sendEmail = async (options: any) => {
  const transporter = nodeMailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT as string),
    auth: {
      user: process.env.EMAIL_USERNAME as string,
      pass: process.env.EMAIL_PASSWORD as string,
    },
  });

  const mailOptions = {
    from: "AliDeWeb",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
