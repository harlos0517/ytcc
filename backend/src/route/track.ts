import express from 'express'

import { TrackModel } from '../schema/track'
import { InfoModel } from '../schema/info'

import { auth } from './user'

const router = express.Router()

router.get('/track/:id', auth, async(req, res, _next) => {
  const videoId = req.params.id
  const track = await TrackModel.findById(videoId).exec()
  res.status(200).send({ data: track })
})

router.get('/track/:id/infos', auth, async(req, res, _next) => {
  const trackId = req.params.id
  const infos = await InfoModel.find({ track_id: trackId })
  res.status(200).send({ data: infos })
})

router.post('/track', auth, async(req, res, _next) => {
  const { videoId } = req.body
  const newTrack = await TrackModel.create({
    video_id: videoId,
    type: 'cc',
    default_style: null,
  })
  res.status(200).send({ data: newTrack })
})

export default router
