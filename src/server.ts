import mongoose from 'mongoose'
import config from './app/config'
import app from './app'
import { Server } from 'http'
import seedSuperAdmin from './app/DB'

let server: Server

async function main() {
  try {
    await mongoose.connect(config.data_base_url as string)
    await seedSuperAdmin()
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`)
    })
  } catch (err) {
    console.log('Error From Server', err)
  }
}

main()

process.on('unhandledRejection', () => {
  console.log('😡 Unhandle Reject is  Detected. Sutting Down....')
  if (server) {
    server.close(() => {
      process.exit(1)
    })
  }
  process.exit(1)
})

// Promise.reject()

process.on('uncaughtException', () => {
  console.log('😡 Uncaught Exception is  Detected. Sutting Down....')

  process.exit(1)
})
