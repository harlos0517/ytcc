import express from 'express'

import { TrackModel } from '@/schema/track'
import { InfoModel } from '@/schema/info'
import * as TrackApi from '@api/track'

import { auth } from '@/middleware'

const router = express.Router()

router.get('/track/:id', auth, async(req, res, _next) => {
  const trackId = req.params.id
  const track = await TrackModel.findById(trackId).exec()
  if (!track) return res.sendStatus(400)
  const data: TrackApi.GetTrack.Response = track
  res.status(200).send({ data })
})

router.get('/track/:id/infos', auth, async(req, res, _next) => {
  const trackId = req.params.id
  const infos = await InfoModel.find({ trackId })
  const data: TrackApi.GetTrackInfos.Response = infos
  res.status(200).send({ data })
})

router.post('/track', auth, async(req, res, _next) => {
  const { videoId } = req.body as TrackApi.PostTrack.Request
  const newTrack = await TrackModel.create({
    videoId,
    userId: req.session.user?._id,
    type: 'cc',
    defaultStyle: null,
  })
  const data: TrackApi.PostTrack.Response = newTrack
  res.status(200).send({ data })
})

router.delete('/track/:id', auth, async(req, res, _next) => {
  const trackId = req.params.id
  const track = await TrackModel.findByIdAndRemove(trackId).exec()
  if (!track) return res.sendStatus(400)
  await InfoModel.deleteMany({ trackId })
  res.sendStatus(200)
})

export default router
