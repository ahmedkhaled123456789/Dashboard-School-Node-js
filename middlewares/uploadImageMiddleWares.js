// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");

const multerOption = () =>{
// diskStorage


// memoryStorage
const multerStorage = multer.memoryStorage();

const multerfilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("only images allowed"), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerfilter });

return upload;
}
 


exports.uploadSingleImage=(fieldName) => multerOption().single(fieldName )

exports.resizeImage = (folder) => asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const fileName = `${folder}-${uuidv4()}-${Date.now()}.jpeg`;
  const uploadDirectory = path.join(process.cwd(), "uploads", folder);

  await fs.promises.mkdir(uploadDirectory, { recursive: true });
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(path.join(uploadDirectory, fileName));

  req.body.image = fileName;
  next();
});


exports.uploadMixOfImages= (arrayFields) =>  multerOption().fields(arrayFields)