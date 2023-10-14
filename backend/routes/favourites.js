import express from 'express'
import { getLiked, like } from '../controllers/favourite.js'

const router = express.Router()

router.get('/', getLiked)
router.post('/like', like)

export default router
