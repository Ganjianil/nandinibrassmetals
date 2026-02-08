import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "nandini_products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

export const productUpload = multer({
  storage: productStorage,
});
