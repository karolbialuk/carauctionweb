import express from "express";
import {
  addAuction,
  getAuctions,
  getAuctionsByUser,
  deleteAuction,
  updateAuction,
  searchAuctions,
  filterAuctions,
} from "../controllers/auction.js";
import multer from "multer";
import path from "path";
import sharp from "sharp";

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

router.post("/", upload.array("images", 5), addAuction);
router.get("/", getAuctions);
router.get("/search", searchAuctions);
router.get("/filter", filterAuctions);
router.get("/myauctions", getAuctionsByUser);
router.delete("/:auctionId", deleteAuction);
router.put("/", upload.array("images", 5), updateAuction);

export default router;
