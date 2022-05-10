import express from 'express'

import { InfoModel } from '@/schema/info'
import * as InfoApi from '@api/info'

import { auth } from '@/middleware'

import { toStringArray } from '@/util/general'
import { typedRequestHandler, withUserId } from '@/util/route'

const router = express.Router()

router.get('/infos', auth,
  typedRequestHandler<InfoApi.GetInfos.Response>(async(req, res) => {
    const ids = toStringArray(req.query.ids)
    if (!ids) return res.sendStatus(400)
    const infos = await Promise.all(
      ids.map(id => InfoModel.findOne({ _id: id })),
    )
    return res.status(200).send({ data: infos })
  }),
)

router.post('/infos', auth,
  typedRequestHandler<InfoApi.PostInfos.Response, InfoApi.PostInfos.Request>(async(req, res) => {
    const infos = req.body
    const newInfos = await InfoModel.insertMany(
      infos.map(info => withUserId(req, info)),
    )
    return res.status(200).send({ data: newInfos })
  }),
)

router.put('/infos', auth,
  typedRequestHandler<InfoApi.PutInfos.Response, InfoApi.PutInfos.Request>(async(req, res) => {
    const infos = req.body
    const newInfos = await Promise.all(infos.map(
      async info => {
        const target = withUserId(req, { _id: info._id })
        return InfoModel.findOneAndUpdate(target, info).exec()
      },
    ))
    return res.status(200).send({ data: newInfos })
  }),
)

router.delete('/infos', auth,
  typedRequestHandler(async(req, res) => {
    const ids = toStringArray(req.query.ids)
    if (!ids) return res.sendStatus(400)
    await Promise.all(ids.map(
      async id => {
        const target = withUserId(req, { _id: id })
        const info = await InfoModel.findOne(target)
        if (!info) return null
        return await InfoModel.findOneAndDelete(target).exec()
      },
    ))
    return res.sendStatus(200)
  }),
)

export default router
