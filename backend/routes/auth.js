import express from "express";
import {
  login,
  register,
  users,
  updateUser,
  deleteUser,
} from "../controllers/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Dozwolone tylko zdjęcia"), false);
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public/upload");
  },
  filename: (req, file, cb) => {
    const uniqueFileName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueFileName);
  },
});

const upload = multer({ storage: storage, fileFilter: imageFilter });

router.post("/login", login);
router.post("/register", upload.single("image"), register);
router.get("", users);
router.put("", upload.single("image"), updateUser);
router.delete("/delete", deleteUser);

export default router;
