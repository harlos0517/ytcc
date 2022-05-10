import express from 'express'

import { TrackModel } from '@/schema/track'
import { InfoModel } from '@/schema/info'
import * as TrackApi from '@api/track'

import { auth } from '@/middleware'
import { typedRequestHandler, withUserId } from '@/util/route'

const router = express.Router()

router.get('/track/:id', auth,
  typedRequestHandler<TrackApi.GetTrack.Response>(async(req, res) => {
    const trackId = req.params.id
    const track = await TrackModel.findById(trackId).exec()
    if (!track) return res.sendStatus(400)
    return res.status(200).send({ data: track })
  }),
)

router.get('/track/:id/infos', auth,
  typedRequestHandler<TrackApi.GetTrackInfos.Response>(async(req, res) => {
    const trackId = req.params.id
    const infos = await InfoModel.find({ trackId })
    return res.status(200).send({ data: infos })
  }),
)

router.get('/tracks/me', auth,
  typedRequestHandler<TrackApi.GetMyTracks.Response>(async(req, res) => {
    const tracks = await TrackModel.find(withUserId(req, {}))
    return res.status(200).send({ data: tracks })
  }),
)

router.get('/tracks/public', auth,
  typedRequestHandler<TrackApi.GetPublicTracks.Response>(async(req, res) => {
    const videoId = req.query.videoId
    if (typeof videoId !== 'string') return res.sendStatus(400)
    const tracks = await TrackModel.find({ videoId, public: true })
    return res.status(200).send({ data: tracks })
  }),
)

router.post('/track', auth,
  typedRequestHandler<TrackApi.PostTrack.Response, TrackApi.PostTrack.Request>(async(req, res) => {
    const { videoId } = req.body
    const newTrack = await TrackModel.create(
      withUserId(req, {
        videoId,
        name: 'New Track',
        public: false,
        type: 'cc',
        defaultStyle: null,
      }),
    )
    return res.status(200).send({ data: newTrack })
  }),
)

router.put('/track', auth,
  typedRequestHandler<TrackApi.PutTrack.Response, TrackApi.PutTrack.Request>(async(req, res) => {
    const track = req.body
    const target = { _id: track._id, userId: req.session.user?._id }
    const updatedTrack = await TrackModel.findOneAndUpdate(target, track)
    if (!updatedTrack) return res.sendStatus(404)
    return res.status(200).send({ data: updatedTrack })
  }),
)

router.delete('/track/:id', auth,
  typedRequestHandler(async(req, res) => {
    const trackId = req.params.id
    const target = { _id: trackId, userId: req.session.user?._id }
    const track = await TrackModel.findOne(target)
    if (!track) return res.sendStatus(404)

    await TrackModel.findOneAndDelete(target).exec()
    await InfoModel.deleteMany({ trackId })
    return res.sendStatus(200)
  }),
)

export default router
