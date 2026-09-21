const express = require('express');
const dotenv = require("dotenv");
const morgan = require('morgan');
const cors = require('cors');
dotenv.config({ path: "config.env" });

const dbConnect= require('./config/dbConnect');
const couponRoutes = require('./routes');
const globalError = require('./middlewares/globalError');
const ApiError = require('./utils/apiError');
const app = express();
app.use(cors());
//pm.environment.set("JWT", pm.response.json().token);
//  middlewares
app.use(express.json());
// connect to database
dbConnect();
//middleware
app.use(morgan("dev"));
  
// mount routes
app.get("/api", (req, res) => {
  res.status(200).json({ status: "success", message: "School Management API is running" });
});
// app.get('/test', (req,res) =>{
//   res.send('Hello World!');
// })
couponRoutes(app); 
// create error and send it to handling error
app.all("*", (req, res, next) => {
  // const err = new Error(`can't find this route ${req.originalUrl}`);
  // next(err.message);
  next(new ApiError(`can't find this route ${req.originalUrl}`, 400));
});

//  Global error handling middleware
app.use(globalError);

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`server is running in port ${PORT}`);
  });
}

module.exports = app;


// Handle Errors Rejections Outside Express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error ${err.name} ${err.message}`);
  process.exit(1);
});

