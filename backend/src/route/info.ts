import express from 'express'

import { Info, InfoModel } from '../schema/info'

import { auth } from './user'

const router = express.Router()

router.post('/infos', auth, async(req, res, _next) => {
  const { infos } = req.body
  await InfoModel.insertMany(infos)
  res.sendStatus(200)
})

router.put('/infos', auth, async(req, res, _next) => {
  const { infos } = req.body
  await Promise.all(infos.map(
    (info: Info) => InfoModel.updateOne({ _id: info._id }, info),
  ))
  res.sendStatus(200)
})

export default router
