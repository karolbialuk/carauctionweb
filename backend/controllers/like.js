import { db } from '../connect.js'
import jwt from 'jsonwebtoken'

export const getLikes = (req, res) => {
  const token = req.cookies.accessToken

  if (!token) return res.status(404).json('Nie jesteś zalogowany')

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Token jest nieprawidłowy')

    const q = 'SELECT * FROM likes'

    db.query(q, (err, data) => {
      if (err) return res.status(404).json('Wystąpił błąd')
      return res.status(200).json(data)
    })
  })
}

export const like = (req, res) => {
  const token = req.cookies.accessToken
  if (!token) return res.status(404).json('Nie jesteś zalogowany')

  const idUser = req.body.userId
  const idAuction = req.body.id
  const idComment = req.body.idComment

  jwt.verify(token, 'secretkey', (err, userInfo) => {
    if (err) return res.status(401).json('Token jest nieprawidłowy')

    const q =
      'SELECT * FROM likes WHERE idUser = ? AND idAuction = ? AND idComment = ?'

    db.query(q, [idUser, idAuction, idComment], (err, data) => {
      if (err) return res.status(404).json('Wystąpił błąd')

      let q = data.length
        ? 'DELETE FROM likes WHERE idUser = ? AND idAuction = ? AND idComment = ?'
        : 'INSERT INTO likes (`idUser`,`idAuction`,`idComment`) VALUES (?,?,?)'

      db.query(q, [idUser, idAuction, idComment], (err, data) => {
        if (err) return res.status(404).json('Wystąpił błąd')
        return res.status(200).json(data)
      })
    })
  })
}
