import { db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getComments = (req, res) => {
  const token = req.cookies.accessToken
  const idAuction = req.query.idAuction

  if (!token) return res.status(404).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(404).json('Nieprawidłowy token!')

    const q =
      'SELECT c.id, c.comment, u.username, c.idUser FROM comments c JOIN users u ON u.id = c.idUser  WHERE idAuction = ? ORDER BY c.id ASC'
    db.query(q, [idAuction], (err, data) => {
      if (err) return res.status(500).json(err)
      return res.status(200).json(data)
    })
  })
}
export const addComment = (req, res) => {
  const token = req.cookies.accessToken
  const auctionId = req.body.auctionId
  const userId = req.body.userId
  const comment = req.body.comment

  if (!token) return res.status(401).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(404).json('Nieprawidłowy token!')

    const q =
      'INSERT INTO comments (`idAuction`,`idUser`,`comment`) VALUES (?, ?, ?)'

    db.query(
      q,
      [req.body.auctionId, req.body.userId, req.body.comment],
      (err, data) => {
        if (err) {
          console.error(err)
          return res.status(500).json(err)
        }
        return res.status(200).json(data)
      },
    )
  })
}
