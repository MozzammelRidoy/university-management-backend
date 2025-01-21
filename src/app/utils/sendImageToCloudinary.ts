import { v2 as cloudinary } from 'cloudinary'
import config from '../config'
import multer from 'multer'
import fs from 'fs'

// Configuration
cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
})
export const sendImageToCloudinay = async (
  imageName: string,
  path: string,
): Promise<Record<string, unknown>> => {
  try {
    const uploadResult = await cloudinary.uploader.upload(path, {
      public_id: imageName,
    })

    // Remove the local file after upload
    fs.unlink(path, err => {
      if (err) {
        console.error(`Error deleting file at ${path}:`, err)
      }
    })

    return uploadResult
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error)
    throw new Error('Image upload failed')
  }
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  },
})

export const upload = multer({ storage: storage })
