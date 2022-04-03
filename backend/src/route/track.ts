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

router.get('/tracks/me', auth, async(req, res, _next) => {
  const tracks = await TrackModel.find({ userId: req.session.user?._id })
  const data: TrackApi.GetMyTracks.Response = tracks
  res.status(200).send({ data })
})

router.get('/tracks/public', auth, async(req, res, _next) => {
  const videoId = req.query.videoId
  if (typeof videoId !== 'string') return res.sendStatus(400)
  const tracks = await TrackModel.find({ videoId, public: true })
  const data: TrackApi.GetPublicTracks.Response = tracks
  res.status(200).send({ data })
})

router.post('/track', auth, async(req, res, _next) => {
  const { videoId } = req.body as TrackApi.PostTrack.Request
  const newTrack = await TrackModel.create({
    videoId,
    userId: req.session.user?._id,
    name: 'New Track',
    public: false,
    type: 'cc',
    defaultStyle: null,
  })
  const data: TrackApi.PostTrack.Response = newTrack
  res.status(200).send({ data })
})

router.put('/track', auth, async(req, res, _next) => {
  const track = req.body as TrackApi.PutTrack.Request

  const target = { _id: track._id, userId: req.session.user?._id }
  const newTrack = await TrackModel.findOne(target)
  if (!newTrack) return res.sendStatus(404)

  const updatedTrack = await TrackModel.findOneAndUpdate(target, track)
  if (!updatedTrack) return res.sendStatus(404)

  const data: TrackApi.PutTrack.Response = updatedTrack
  res.status(200).send({ data })
})

router.delete('/track/:id', auth, async(req, res, _next) => {
  const trackId = req.params.id
  const target = { _id: trackId, userId: req.session.user?._id }
  const track = await TrackModel.findOne(target)
  if (!track) return res.sendStatus(404)

  await TrackModel.findOneAndDelete(target).exec()
  await InfoModel.deleteMany({ trackId })
  res.sendStatus(200)
})

export default router
