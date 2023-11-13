import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";
import sharp from "sharp";
import path from "path";
import { userInfo } from "os";
import emailValidator from "email-validator";

export const login = (req, res) => {
  const q = "SELECT * FROM users WHERE login = ?";

  db.query(q, [req.body.login], (err, data) => {
    if (err) return res.status(500).json(err);

    const values = [req.body.login, req.body.password];

    if (values.includes(""))
      return res.status(404).json("Wypełnij wszystkie pola");

    if (data.length === 0)
      return res.status(404).json("Nie znaleziono takiego użytkownika.");

    const checkedPassword = bcrypt.compareSync(
      req.body.password,
      data[0].password
    );

    if (!checkedPassword) return res.status(400).json("Nieprawidłowe hasło");

    const token = jwt.sign({ id: data[0].id }, "secretkey");

    const { password, ...others } = data[0];

    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  });
};

export const register = async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Nie jesteś zalogowany");

  try {
    jwt.verify(token, "secretkey", async (err, userInfo) => {
      const file = req.file;
      let uploadedFileNames = [];

      if (file) {
        const uniqueFileName =
          Date.now() + "-" + Math.round(Math.random() * 1e9);
        const upload = "../frontend/public/upload/";

        const highResFilePath =
          upload + uniqueFileName + "_high" + path.extname(file.originalname);
        await sharp(file.path).resize(600, 600).toFile(highResFilePath);

        const lowResFilePath =
          upload + uniqueFileName + "_low" + path.extname(file.originalname);
        await sharp(file.path).resize(250, 250).toFile(lowResFilePath);

        uploadedFileNames = [
          path.basename(highResFilePath),
          path.basename(lowResFilePath),
        ];
      }

      const q =
        "SELECT * FROM users WHERE login = ? OR username = ? OR email = ?";

      db.query(
        q,
        [req.body.login, req.body.username, req.body.email],
        (err, data) => {
          if (err) return res.status(500).json(err);
          if (data.length)
            return res
              .status(500)
              .json(
                "Użytkownik o podanym loginie, nazwie lub emailu już istnieje."
              );

          const salt = bcrypt.genSaltSync(10);
          const hashedPassword =
            req.body.password && req.body.password.length
              ? bcrypt.hashSync(req.body.password, salt)
              : "";

          const q =
            "INSERT INTO users (`login`,`password`,`username`,`email`,`telefon`,`img`) VALUE (?)";

          const values = [
            req.body.login,
            hashedPassword,
            req.body.username,
            req.body.email,
            req.body.telefon,
            file ? uploadedFileNames.join(",") : "brak",
          ];

          const emailIsValid = emailValidator.validate(req.body.email);

          if (values.includes(""))
            return res.status(500).json("Wypełnij wszystkie pola.");

          if (req.body.telefon.length !== 9) {
            return res.status(500).json("Numer telefonu jest nieprawidłowy.");
          }

          if (!emailIsValid) {
            return res.status(500).json("Podano nieprawidłowy adres e-mail.");
          }

          db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Pomyślnie utworzono konto.");
          });
        }
      );
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json("Wystąpił błąd podczas weryfikacji tokenu.");
  }
};

export const users = (req, res) => {
  const q = "SELECT * FROM users WHERE id = ? ";

  db.query(q, [req.query.userId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updateUser = async (req, res) => {
  const token = req.cookies.accessToken;

  if (!token) return res.status(401).json("Nie jesteś zalogowany");
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword =
    req.body.password && req.body.password.length
      ? bcrypt.hashSync(req.body.password, salt)
      : "";

  try {
    jwt.verify(token, "secretkey", async (userInfo, err) => {
      const file = req.file;
      let uploadedFileNames = [];

      const query = "SELECT * FROM users WHERE username = ? OR email = ?";

      if (file) {
        const uniqueFileName =
          Date.now() + "-" + Math.round(Math.random() * 1e9);
        const upload = "../frontend/public/upload/";

        const highResFilePath =
          upload + uniqueFileName + "_high" + path.extname(file.originalname);
        await sharp(file.path).resize(600, 600).toFile(highResFilePath);

        const lowResFilePath =
          upload + uniqueFileName + "_low" + path.extname(file.originalname);
        await sharp(file.path).resize(250, 250).toFile(lowResFilePath);

        uploadedFileNames = [
          path.basename(highResFilePath),
          path.basename(lowResFilePath),
        ];

        db.query(query, [req.body.username, req.body.email], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }

          if (data.length) {
            return res
              .status(400)
              .json("Użytkownik o podanej nazwie lub mailu już istnieje.");
          }

          const updateFields = [];
          if (uploadedFileNames.length > 0) {
            updateFields.push("`img`=?");
          }
          if (req.body.username) {
            updateFields.push("`username`=?");
          }
          if (req.body.email) {
            updateFields.push("`email`=?");
          }

          if (req.body.password) {
            updateFields.push("`password`=?");
          }

          const updateQuery =
            "UPDATE users SET " + updateFields.join(", ") + " WHERE id = ?";

          const userInfo = jwt.verify(token, "secretkey");

          const values = [
            uploadedFileNames.join(","),
            req.body.username,
            req.body.email,
            req.body.password,
            userInfo.id,
          ].filter(Boolean); // Filter out falsy values (empty strings)

          db.query(updateQuery, values, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json(err);
            }
            return res.status(200).json(data);
          });
        });
      } else if (req.body.username || req.body.email) {
        const query = "SELECT * FROM users WHERE username = ? OR email = ?";

        db.query(query, [req.body.username, req.body.email], (err, data) => {
          if (err) {
            console.error(err);
            return res.status(500).json(err);
          }

          if (data.length) {
            return res
              .status(400)
              .json("Użytkownik o podanej nazwie lub mailu już istnieje.");
          }

          const updateFields = [];
          if (req.body.username) {
            updateFields.push("`username`=?");
          }
          if (req.body.email) {
            updateFields.push("`email`=?");
          }

          if (req.body.password) {
            updateFields.push("`password`=?");
          }

          const updateQuery =
            "UPDATE users SET " + updateFields.join(", ") + " WHERE id = ?";

          const userInfo = jwt.verify(token, "secretkey");

          const values = [
            req.body.username,
            req.body.email,
            req.body.password,
            userInfo.id,
          ].filter(Boolean);

          db.query(updateQuery, values, (err, data) => {
            if (err) {
              console.error(err);
              return res.status(500).json(err);
            }

            const emailIsValid = emailValidator.validate(req.body.email);

            if (!emailIsValid) {
              return res
                .status(500)
                .json("Podany adres e-mail ma nieprawidłowy format.");
            }

            return res.status(200).json(data);
          });
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(200).json("Wystąpił błąd podczas weryfikacji tokenu.");
  }
};

export const deleteUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Nie jesteś zalogowany");

  jwt.verify(token, "secretkey", (userInfo, err) => {
    const q = "DELETE FROM users WHERE id = ?";

    db.query(q, [req.query.userId], (err, data) => {
      if (err) {
        return res.status(500).json(err);
      }
      return res.status(200).json("Pomyślnie usunięto konto.");
    });
  });
};
