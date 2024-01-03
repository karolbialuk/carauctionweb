import mysql2 from 'mysql2'

export const db = mysql2.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'password',
  database: 'cars',
})
