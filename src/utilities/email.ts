import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const transporter = nodemailer.createTransport({
  service: "Outlook365",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "MedEase",
    link: process.env.APP_LINK || "#",
  },
});

export const sendEmail = async (to: string, subject: string, body: string) => {
  const email = mailGenerator.generate({
    body: {
      name: "User",
      intro:
        `This is a notification from MedEase. <br><br> <img src=${process.env.APP_IMAGE_LINK} alt="Image" />`,
      table: {
        data: [
          {
            item: "Status",
            information: body,
          },
        ],
        columns: {
          customWidth: {
            item: "20%",
            price: "15%",
          },
          customAlignment: {
            price: "right",
          },
        },
      },
      action: {
        instructions: "Click the button below to view your profile:",
        button: {
          color: "#22BC66",
          text: "View Profile",
          link: `${process.env.APP_LINK}/profile`,
        },
      },
      outro:
        "If you have any questions, please reply to this email. Thank you for choosing MedEase!",
      signature: "Best regards",
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    html: email,
  };

  try {
    const r = await transporter.sendMail(mailOptions);
    console.log(r);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
};
