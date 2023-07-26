import { json } from 'express'
import { db } from '../connect.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const login = (req, res) => {
  const q = 'SELECT * FROM users WHERE login = ?'

  db.query(q, [req.body.login], (err, data) => {
    if (err) return res.status(500).json(err)

    const values = [req.body.login, req.body.password]

    if (values.includes(''))
      return res.status(404).json('Wypełnij wszystkie pola')

    if (data.length === 0)
      return res.status(404).json('Nie znaleziono takiego użytkownika.')

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password,
    )

    if (!checkedPassword) return res.status(400).json('Nieprawidłowe hasło')

    const token = jwt.sign({ id: data[0].id }, 'secretkey')

    const { password, ...others } = data[0]

    res
      .cookie('accessToken', token, {
        httpOnly: true,
      })
      .status(200)
      .json(others)
  })
}

export const register = (req, res) => {
  const q = 'SELECT * FROM users WHERE login = ? OR username = ? OR email = ?'

  db.query(
    q,
    [req.body.login, req.body.username, req.body.email],
    (err, data) => {
      if (err) return res.status(500).json(err)
      if (data.length)
        return res
          .status(404)
          .json('Użytkownik o podanym loginie, nazwie lub emailu już istnieje.')

      const salt = bcrypt.genSaltSync(10)
      const hashedPassword = req.body.password.length
        ? bcrypt.hashSync(req.body.password, salt)
        : ''

      const q =
        'INSERT INTO users (`login`,`password`,`username`,`email`) VALUE (?)'

      const values = [
        req.body.login,
        hashedPassword,
        req.body.username,
        req.body.email,
      ]

      if (values.includes(''))
        return res.status(404).json('Wypełnij wszyskie pola.')

      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err)
        return res.status(200).json('Pomyślnie utworzono konto.')
      })
    },
  )
}
