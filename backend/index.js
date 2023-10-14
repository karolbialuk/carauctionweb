import express from 'express'
import authRoutes from './routes/auth.js'
import auctionRoutes from './routes/auctions.js'
import favouriteRoutes from './routes/favourites.js'
import brandRoutes from './routes/brands.js'
import commentsRoutes from './routes/comments.js'
import likesRoutes from './routes/likes.js'
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
app.use('/api/favourites', favouriteRoutes)
app.use('/api/comments', commentsRoutes)
app.use('/api/likes', likesRoutes)

app.listen(8800, () => {
  console.log('Api working')
})
