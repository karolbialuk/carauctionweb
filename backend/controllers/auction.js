import { db } from '../connect.js'
import jwt from 'jsonwebtoken'
import moment from 'moment'

export const addAuction = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Token jest nieprawidłowy')

    const q =
      'INSERT INTO auctions(`brand`,`model`,`productionYear`,`fuelType`,`mileage`,`localization`,`color`,`startingPrice`,`capacity`,`img`,`description`,`addedAt`,`userId`) values(?)'

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
      req.body.img,
      req.body.description,
      moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
      userInfo.id,
    ]

    if (values.includes('')) {
      return res.status(404).json('Wypełnij wszystkie pola')
    }

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json('Aukcja została dodana')
    })
  })
}
