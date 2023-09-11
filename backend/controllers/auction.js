import { db } from '../connect.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'
import sharp from 'sharp'
import path from 'path'
import { userInfo } from 'os'

export const addAuction = async (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  try {
    const userInfo = jwt.verify(token, 'secretkey')

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

    const q =
      'INSERT INTO auctions(`brand`,`model`,`productionYear`,`fuelType`,`mileage`,`localization`,`color`,`startingPrice`,`capacity`,`vin`,`transmission`,`bodyStyle`, `interiorColor`, `sellerType`, `img`,`description`,`highlights`,`equipment`,`flaws`,`addedAt`,`userId`) values(?)'

    const values = [
      req.body.brand,
      req.body.model,
      req.body.productionYear,
      req.body.fuelType,
      req.body.mileage,
      req.body.localization,
      req.body.color,
      req.body.startingPrice,
      req.body.capacity,
      req.body.vin,
      req.body.transmission,
      req.body.bodyStyle,
      req.body.interiorColor,
      req.body.sellerType,
      uploadedFileNames.join(','),
      req.body.description,
      req.body.highlights,
      req.body.equipment,
      req.body.flaws,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
    ]

    if (values.includes('')) {
      return res.status(404).json('Wypełnij wszystkie pola')
    }

    db.query(q, [values], (err, data) => {
      if (err) {
        console.error(err)
        return res.status(500).json(err)
      }
      return res.status(200).json(data)
    })
  } catch (error) {
    console.error(error)
    return res.status(401).json('Wystąpił błąd podczas weryfikacji tokenu.')
  }
}

export const getAuctions = (req, res) => {
  const postId = req.query.postId

  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    const q =
      postId === undefined
        ? 'SELECT a.id, b.id as brandId, m.id as modelId, a.productionYear, m.modelName, b.brandName, a.fuelType, a.mileage, a.localization, a.color, a.startingPrice, a.capacity, a.vin, a.transmission, a.bodyStyle, a.interiorColor, a.sellerType, a.description, a.highlights, a.equipment, a.flaws, a.img, a.userId FROM auctions a JOIN models m ON a.model = m.id JOIN brands b ON m.idBrand = b.id'
        : 'SELECT a.id, b.id as brandId, m.id as modelId, a.productionYear, m.modelName, b.brandName, a.fuelType, a.mileage, a.localization, a.color, a.startingPrice, a.capacity, a.vin, a.transmission, a.bodyStyle, a.interiorColor, a.sellerType, a.description, a.highlights, a.equipment, a.flaws, a.img, a.userId FROM auctions a JOIN models m ON a.model = m.id JOIN brands b ON m.idBrand = b.id WHERE a.id = ?'

    const values = postId === undefined ? [] : [postId]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}

export const getAuctionsByUser = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    const q =
      'SELECT a.id, b.id as brandId, m.id as modelId, a.productionYear, m.modelName, b.brandName, a.fuelType, a.mileage, a.localization, a.color, a.startingPrice, a.capacity, a.vin, a.transmission, a.bodyStyle, a.interiorColor, a.sellerType, a.description, a.highlights, a.equipment, a.flaws, a.img, a.userId FROM auctions a JOIN models m ON a.model = m.id JOIN brands b ON m.idBrand = b.id WHERE a.userId = ?'

    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}

export const deleteAuction = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Nieprawidłowy token')
    const q = 'DELETE FROM auctions WHERE `userId` = ? AND `id` = ?'

    db.query(q, [userInfo.id, req.params.auctionId], (err, data) => {
      if (err) return res.status(500).json(err)

      return res.status(200).json(data)
    })
  })
}

export const updateAuction = async (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  try {
    const userInfo = jwt.verify(token, 'secretkey')

    const files = req.files
    if (!files) return res.status(401).json('brak files')
    const uploadedFileNames = []

    if (files.length > 0) {
      for (const file of files) {
        const uniqueFileName =
          Date.now() + '-' + Math.round(Math.random() * 1e9)

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
    }

    const q =
      'UPDATE auctions SET `brand`=?,`model`=?,`productionYear`=?,`fuelType`=?,`mileage`=?,`localization`=?,`color`=?,`startingPrice`=?,`capacity`=?,`vin`=?,`transmission`=?,`bodyStyle`=?,`interiorColor`=?,`sellerType`=?,`img`=?,`description`=?,`highlights`=?,`equipment`=?,`flaws`=? WHERE  id = ? AND userId = ?'

    db.query(
      q,
      [
        req.body.brand,
        req.body.model,
        req.body.productionYear,
        req.body.fuelType,
        req.body.mileage,
        req.body.localization,
        req.body.color,
        req.body.startingPrice,
        req.body.capacity,
        req.body.vin,
        req.body.transmission,
        req.body.bodyStyle,
        req.body.interiorColor,
        req.body.sellerType,
        files.length > 0 ? uploadedFileNames.join(',') : req.body.img,
        req.body.description,
        req.body.highlights,
        req.body.equipment,
        req.body.flaws,
        req.body.auctionId,
        userInfo.id,
      ],
      (err, data) => {
        if (err) {
          console.error(err)
          return res.status(500).json(err)
        }
        return res.status(200).json(data)
      },
    )
  } catch (error) {
    console.error(error)
    return res.status(401).json('Wystąpił błąd podczas weryfikacji tokenu.')
  }
}
