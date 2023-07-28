import { db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getBrand = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Token jest nieprawidłowy')

    const q = 'SELECT brandName, id FROM brands'

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}

export const getModel = (req, res) => {
  const brandId = req.query.brandId
  const token = req.cookies.accessToken

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).status('Token jest nieprawidłowy')

    const q = 'SELECT modelName, id FROM models WHERE idBrand = ?'

    db.query(q, [brandId], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}
