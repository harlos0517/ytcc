import express from 'express'
import axios from 'axios'

import { VideoDoc, VideoModel } from '@/schema/video'
import { TrackModel } from '@/schema/track'
import { UserModel } from '@/schema/user'
import * as VideoApi from '@api/video'

import { auth } from '@/middleware'

const router = express.Router()

router.get('/video/:id', auth, async(req, res, _next) => {
  const { id } = req.params
  const video = await VideoModel.findById(id)
  if (!video) return res.sendStatus(404)
  const data: VideoApi.GetVideoById.Response = video
  res.status(200).send({ data })
})

router.get('/video/:id/tracks', auth, async(req, res, _next) => {
  const { id } = req.params
  const videos = await TrackModel.find({
    videoId: id,
    userId: req.session.user?._id,
  })
  const data: VideoApi.GetVideoTracks.Response = videos
  res.status(200).send({ data })
})

router.get('/video/:id/tracks/public', auth, async(req, res, _next) => {
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
  const data: VideoApi.GetVideoPublicTracks.Response = videosWithUsers
  res.status(200).send({ data })
})

router.get('/videos/me', auth, async(req, res, _next) => {
  const tracks = await TrackModel.find({ userId: req.session.user?._id })
  const videoIds = [...new Set(tracks.map(track => String(track.videoId)))]
  const videos = await Promise.all(videoIds.map(async id => await VideoModel.findById(id)))
  const data: VideoApi.GetMyVideos.Response = videos.filter((x): x is (VideoDoc & { _id: string }) => !!x)
  res.status(200).send({ data })
})

router.post('/video', auth, async(req, res, _next) => {
  const { videoLink } = req.body as VideoApi.PostVideo.Request
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
      const data: VideoApi.PostVideo.Response = newVideo
      res.status(200).send({ data })
    }).catch(err => {
      return res.status(400).send({ error: 'Fetch Url Error: ' + err })
    })
})

export default router
