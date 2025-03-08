import express, { Request, Response } from 'express'
import cors from 'cors'
import globalErrorHandler from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import routers from './app/routers'
import cookieParser from 'cookie-parser'
const app = express()

// parser
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

// route
app.use('/api/v1/', routers)

const test = async (req: Request, res: Response) => {
  // Promise.reject()
  res.send('Test Route Working.')
}

app.get('/', test)

app.use(globalErrorHandler as unknown as express.ErrorRequestHandler)
app.use(notFound as unknown as express.ErrorRequestHandler)

export default app
