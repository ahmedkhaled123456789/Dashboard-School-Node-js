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
app.use(express.json());
// connect to database
dbConnect();
//middleware
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// mount routes
mountRoutes(app);
// create error and send it to handling error
app.all("*", (req, res, next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}`, 404));
});

//  Global error handling middleware
app.use(globalError);

const PORT= process.env.PORT || 3000;
 //server
const server = app.listen(PORT, () =>
  console.log(`server is running in port ${PORT}`)
);


// Handle Errors Rejections Outside Express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error ${err.name} ${err.message}`);
  server.close(() => {
    console.log("server shutting down");
    process.exit(1);
  });
});

module.exports = app;
