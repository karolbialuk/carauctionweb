import { db } from '../connect.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export const addAuction = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Token jest nieprawidłowy')

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
      req.body.img,
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
      if (err) return res.status(500).json(err)
      return res.status(200).json(console.log(data))
    })
  })
}

export const getAuctions = (req, res) => {
  const postId = req.query.postId

  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    const q =
      postId === undefined
        ? 'SELECT a.id, a.productionYear, m.modelName, b.brandName, a.fuelType, a.mileage, a.localization, a.color, a.startingPrice, a.capacity, a.vin, a.transmission, a.bodyStyle, a.interiorColor, a.sellerType, a.description, a.highlights, a.equipment, a.flaws, a.img FROM auctions a JOIN models m ON a.model = m.id JOIN brands b ON m.idBrand = b.id'
        : 'SELECT a.id, a.productionYear, m.modelName, b.brandName, a.fuelType, a.mileage, a.localization, a.color, a.startingPrice, a.capacity, a.vin, a.transmission, a.bodyStyle, a.interiorColor, a.sellerType, a.description, a.highlights, a.equipment, a.flaws, a.img FROM auctions a JOIN models m ON a.model = m.id JOIN brands b ON m.idBrand = b.id WHERE a.id = ?'

    const values = postId === undefined ? [] : [postId]

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}
