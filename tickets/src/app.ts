import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@rallycoding/common'
import { createTicketRouter } from './routes/new'
import { showTicketRounter } from './routes/show'
import { indexTicketRouter } from './routes'
import { updateTicketRouter } from './routes/update'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRounter)
app.use(indexTicketRouter)
app.use(updateTicketRouter)

app.get('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

export { app }