import express from 'express'
import { login, register, users } from '../controllers/auth.js'

const router = express.Router()

router.post('/login', login)
router.post('/register', register)
router.get('', users)

export default router
