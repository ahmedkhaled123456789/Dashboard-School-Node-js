const express = require('express');
const dotenv = require("dotenv");
const morgan = require('morgan');
const cors = require('cors');
dotenv.config({ path: "config.env" });

const dbConnect= require('./config/dbConnect');
const mountRoutes = require('./routes');
const globalError = require('./middlewares/globalError');
const ApiError = require('./utils/apiError');
const app = express();
app.use(cors());
//  middlewares
// bigger limit so profile pictures (base64) fit in the body
app.use(express.json({ limit: "2mb" }));
// connect to database
dbConnect();
//middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// mount routes
app.get("/api", (req, res) => {
  res.status(200).json({ status: "success", message: "School Management API is running" });
});
mountRoutes(app);
// create error and send it to handling error
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
});

//  Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 3000;

// only listen when run directly (node server.js); on Vercel the app is exported
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`);
  });
}

// Handle Errors Rejections Outside Express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error ${err.name} ${err.message}`);
  // on Vercel, exiting kills the function and every request on it
  if (!process.env.VERCEL) process.exit(1);
});

module.exports = app;
