import express from 'express'
import axios from 'axios'

import { VideoModel } from '../schema/video'

import { auth } from './user'

const router = express.Router()

router.post('/video', auth, async(req, res, _next) => {
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
    }).catch(err => {
      return res.status(400).send({ error: 'Fetch Url Error: ' + err })
    })
})

export default router
