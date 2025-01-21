import nodemailer from 'nodemailer'
import config from '../config'

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: config.goolge_email_for_send_mail,
      pass: config.google_account_app_password,
    },
  })

  await transporter.sendMail({
    from: config.goolge_email_for_send_mail,
    to,
    subject: 'Please Reset Your Password within 10 minutes!', // Subject line
    html, // html body
  })
}
