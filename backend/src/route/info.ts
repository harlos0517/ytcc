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
    userId: req.session.user?._id,
  })))
  const data: InfoApi.PostInfos.Response = newInfos
  res.status(200).send({ data })
})

router.put('/infos', auth, async(req, res, _next) => {
  const infos = req.body as InfoApi.PutInfos.Request
  const newInfos = await Promise.all(infos.map(
    async info => {
      const target = { _id: info._id, userId: req.session.user?._id }
      const newInfo = await InfoModel.findOne(target)
      if (!newInfo) return null
      return await InfoModel.findOneAndUpdate(target, info)
    },
  ))
  const data: InfoApi.PutInfos.Response = newInfos
  res.status(200).send({ data })
})

router.delete('/infos', auth, async(req, res, _next) => {
  const ids = req.query.ids as string[] | undefined
  if (!ids) return res.sendStatus(400)
  const result = await Promise.all(ids.map(
    async id => {
      const target = { _id: id, userId: req.session.user?._id }
      const info = await InfoModel.findOne(target)
      if (!info) return null
      await InfoModel.findOneAndDelete(target).exec()
    },
  ))
  console.log(result)
  res.sendStatus(200)
})

export default router
