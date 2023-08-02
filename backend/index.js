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

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(new Error('Dozwolone tylko zdjęcia'), false)
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../frontend/public/upload')
  },
  filename: (req, file, cb) => {
    const uniqueFileName =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname)
    cb(null, uniqueFileName)
  },
})

const upload = multer({ storage: storage, fileFilter: imageFilter })

app.post('/api/upload', upload.array('images', 5), async (req, res) => {
  const files = req.files
  const uploadedFileNames = []

  for (const file of files) {
    const uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1e9)

    const upload = '../frontend/public/upload/'

    const highResFilePath =
      upload + uniqueFileName + '_high' + path.extname(file.originalname)
    await sharp(file.path).resize(1800, 1200).toFile(highResFilePath)

    const lowResFilePath =
      upload + uniqueFileName + '_low' + path.extname(file.originalname)
    await sharp(file.path).resize(702, 468).toFile(lowResFilePath)

    uploadedFileNames.push(
      path.basename(highResFilePath),
      path.basename(lowResFilePath),
    )
  }

  return res.status(200).json({ uploadedFiles: uploadedFileNames })
})

app.listen(8800, () => {
  console.log('Api working')
})
