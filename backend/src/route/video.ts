import express from 'express'
import axios from 'axios'

import { VideoDoc, VideoModel } from '@/schema/video'
import { TrackModel } from '@/schema/track'
import { UserModel } from '@/schema/user'
import * as VideoApi from '@api/video'

import { auth } from '@/middleware'

import { typedRequestHandler } from '@/util/route'

const router = express.Router()

router.get('/video/:id', auth,
  typedRequestHandler<VideoApi.GetVideoById.Response>(async(req, res) => {
    const { id } = req.params
    const video = await VideoModel.findById(id)
    if (!video) return res.sendStatus(404)
    res.status(200).send({ data: video })
  }),
)

router.get('/video/:id/tracks', auth,
  typedRequestHandler<VideoApi.GetVideoTracks.Response>(async(req, res) => {
    const { id } = req.params
    const videos = await TrackModel.find({
      videoId: id,
      userId: req.session.user?._id,
    })
    res.status(200).send({ data: videos })
  }),
)

router.get('/video/:id/tracks/public', auth,
  typedRequestHandler<VideoApi.GetVideoPublicTracks.Response>(async(req, res) => {
    const { id } = req.params
    const videos = await TrackModel.find({
      videoId: id,
      public: true,
    })
    const videosWithUsers = await Promise.all(videos.map(async video => {
      const user = await UserModel.findById(video.userId)
      // https://stackoverflow.com/questions/58126454/
      return { ...video.toObject(), user }
    }))
    res.status(200).send({ data: videosWithUsers })
  }),
)

router.get('/videos/me', auth,
  typedRequestHandler<VideoApi.GetMyVideos.Response>(async(req, res, _next) => {
    const tracks = await TrackModel.find({ userId: req.session.user?._id })
    const videoIds = [...new Set(tracks.map(track => String(track.videoId)))]
    const videos = await Promise.all(videoIds.map(async id => await VideoModel.findById(id)))
    const myVideos = videos.filter((x): x is (VideoDoc & { _id: string }) => !!x)
    res.status(200).send({ data: myVideos })
  }),
)

router.post('/video', auth,
  typedRequestHandler<VideoApi.PostVideo.Response, VideoApi.PostVideo.Request>(async(req, res) => {
    const { videoLink } = req.body
    const youtubeUrlRegex =
      /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/
    const handleRegex = /[=/][\w-]{11}($|[^\w-])/
    if (!youtubeUrlRegex.test(videoLink))
      return res.status(400).send({ error: 'Inavid Url' })

    axios
      .get(`https://www.youtube.com/oembed?url=${videoLink}&format=json`)
      .then(async _response => {
        const handleMatch = (videoLink as string).match(handleRegex)
        if (!handleMatch) return res.status(400).send({ error: 'Parse Url Error' })
        const handle = handleMatch[0].slice(1, 12)
        const video = await VideoModel.findOne({ handle }).exec()
        if (video) return res.status(200).send({ data: video })
        const newVideo = await VideoModel.create({
          type: 'youtube',
          handle,
          url: `youtu.be/${videoLink}`,
          length: 0,
        })
        res.status(200).send({ data: newVideo })
      })
      .catch(err => {
        return res.status(400).send({ error: 'Fetch Url Error: ' + err })
      })
  }),
)

export default router
