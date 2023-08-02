import express from 'express'
import { addAuction, getAuctions } from '../controllers/auction.js'

const router = express.Router()

router.post('/', addAuction)
router.get('/', getAuctions)

export default router
