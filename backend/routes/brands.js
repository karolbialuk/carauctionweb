import express from 'express'
import { getBrand, getModel } from '../controllers/brand.js'

const router = express.Router()

router.get('/', getBrand)
router.get('/models', getModel)

export default router
