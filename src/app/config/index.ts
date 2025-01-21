import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT || 5000,
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD,
  data_base_url: process.env.DATABASE_URL,
  default_password: process.env.DEFAULT_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_access_token_expiry: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET,
  jwt_refresh_token_expiry: process.env.JWT_REFRESH_EXPIRES_IN,
  goolge_email_for_send_mail: process.env.GOOGLE_EMAIL_FOR_SEND_MAIL,
  google_account_app_password: process.env.GOOGLE_ACCOUNT_APP_PASSWORD,
  reset_pass_ui_link: process.env.RESET_PASS_UI_LINK,
  cloudinary_cloud_name: process.env.CLOUDINAY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINAY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINAY_API_SECRET,
}
