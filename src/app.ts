import express, { Request, Response } from 'express'
import cors from 'cors'
import { router } from './app/routes'
import { globalErrorhandler } from './app/middlewares/globalErrorHandler'
import notFound from './app/middlewares/notFound'
import cookieParser from 'cookie-parser'
const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get('/', (req: Request, res: Response) => {
    res.status(200).send(
        { message: "server is running" }
    )
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
app.use(globalErrorhandler)

app.use(notFound)

export default app