import express from 'express'
import { getLikes, like } from '../controllers/like.js'

const router = express.Router()

router.get('/', getLikes)
router.post('/like', like)

export default router
