import { db } from '../connect.js'
import jwt from 'jsonwebtoken'
import path from 'path'

export const getLiked = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(404).json('Nie jesteś zalogowany')
  }

  const q = 'SELECT * FROM favourite'

  db.query(q, (err, data) => {
    if (err) return res.status(500).json('Wystąpił błąd')

    return res.status(200).json(data)
  })
}

export const like = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) {
    return res.status(404).json('Nie jesteś zalogowany')
  }

  const values = [req.body.auctionId, req.body.userId]

  const selectQuery =
    'SELECT * FROM favourite WHERE idAuction = ? AND idUser = ?'

  db.query(selectQuery, values, (err, data) => {
    if (err) return res.status(500).json(err)

    const q = data.length
      ? 'DELETE FROM favourite WHERE idAuction = ? AND idUser = ?'
      : 'INSERT INTO favourite (`idAuction`, `idUser`) VALUES (?, ?)'

    db.query(q, [req.body.auctionId, req.body.userId], (err, data) => {
      if (err) return res.status(500).json(err)

      const successMessage = data.length
        ? 'Pomyślnie odobserwowano aukcję.'
        : 'Pomyślnie zapisano aukcję.'

      return res.status(200).json(successMessage)
    })
  })
}
