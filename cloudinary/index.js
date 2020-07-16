require("dotenv").config();
const cloudinary = require("cloudinary"),
  cloudinaryStorage = require("multer-storage-cloudinary"),
  multer = require("multer"),
  crypto = require("crypto");

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_api_key,
  api_secret: process.env.cloud_api_secret,
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "happiness",
  allowedFormats: ["jpeg", "jpg", "png"],
  filename: (req, file, cb) => {
    let buf = crypto.randomBytes(16);
    buf = buf.toString("hex");
    let uniqueFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/gi, "");
    uniqueFileName += buf;
    cb(undefined, uniqueFileName);
  },
});

const upload = multer({ storage });

module.exports = {
  cloudinary,
  upload,
};
