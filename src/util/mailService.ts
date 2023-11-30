import nodemailer from 'nodemailer';
import dotenv from "dotenv";
dotenv.config();

export default class mailService {
    static transporter = nodemailer.createTransport({
      service: process.env.SMTP_HOST,
      auth: {
          user: process.env.SMTP_USERNAME, // generated ethereal user
          pass: process.env.SMTP_PASSWORD, // generated ethereal password
        },
      });
}