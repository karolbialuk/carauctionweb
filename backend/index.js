import express from 'express'
import authRoutes from './routes/auth.js'
import auctionRoutes from './routes/auctions.js'
import brandRoutes from './routes/brands.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import sharp from 'sharp'
import v8 from 'v8'

const app = express()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  next()
})
app.use(express.json())
app.use(cors({ origin: 'http://localhost:3000' }))
app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/auctions', auctionRoutes)
app.use('/api/brands', brandRoutes)

app.listen(8800, () => {
  console.log('Api working')
})
