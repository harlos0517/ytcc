import { RequestHandler } from 'express'

// auth middleware
export const auth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.status(401).send({ error: 'Not Authenticated' })
}
