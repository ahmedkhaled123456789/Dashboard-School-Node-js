// eslint-disable-next-line import/no-extraneous-dependencies
const multer = require("multer");
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



exports.uploadMixOfImages= (arrayFields) =>  multerOption().fields(arrayFields)