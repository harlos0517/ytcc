import express from 'express'

import { InfoModel } from '@/schema/info'
import * as InfoApi from '@api/info'

import { auth } from '@/middleware'

const router = express.Router()

router.get('/infos', auth, async(req, res, _next) => {
  const ids = req.query.ids as string[] | undefined
  if (!ids) return res.sendStatus(400)
  const infos = await Promise.all(
    ids.map(id => InfoModel.findOne({ _id: id })),
  )
  const data: InfoApi.GetInfos.Response = infos
  res.status(200).send({ data })
})

router.post('/infos', auth, async(req, res, _next) => {
  const infos = req.body as InfoApi.PostInfos.Request
  const newInfos = await InfoModel.insertMany(infos.map(info => ({
    ...info,
    user_id: req.session.user._id,
  })))
  const data: InfoApi.PostInfos.Response = newInfos
  res.status(200).send({ data })
})

router.put('/infos', auth, async(req, res, _next) => {
  const infos = req.body as InfoApi.PutInfos.Request
  const newInfos = await Promise.all(infos.map(
    info => InfoModel.findOneAndUpdate({ _id: info._id }, info),
  ))
  const data: InfoApi.PutInfos.Response = newInfos
  res.status(200).send({ data })
})

router.delete('/infos', auth, async(req, res, _next) => {
  const ids = req.query.ids as string[] | undefined
  if (!ids) return res.sendStatus(400)
  await Promise.all(ids.map(
    id => InfoModel.findOneAndDelete({ _id: id }),
  ))
  res.sendStatus(200)
})

export default router