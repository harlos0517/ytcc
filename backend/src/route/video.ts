import express from 'express'
import axios from 'axios'

import { VideoModel } from '@/schema/video'
import { TrackModel } from '@/schema/track'
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
    video_id: id,
    user_id: req.session.user._id,
  })
  const data: VideoApi.GetVideoTracks.Response = videos
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
