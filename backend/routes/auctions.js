import express from 'express'
import { addAuction } from '../controllers/auction.js'

const router = express.Router()

router.post('/', addAuction)

export default router
