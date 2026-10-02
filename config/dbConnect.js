const mongoose = require("mongoose");

// Serverless-safe connection: every caller shares one connection promise, and a
// failed attempt is forgotten so the next request retries instead of the
// instance staying disconnected forever (queries would "buffer" then time out).
let connecting = null;

const dbConnect = () => {
  if (mongoose.connection.readyState === 1) {
    return Promise.resolve(mongoose.connection);
  }
  if (!connecting) {
    connecting = mongoose
      .connect(process.env.DB_URI, { serverSelectionTimeoutMS: 8000 })
      .then((conn) => {
        console.log(`Database Connected ${conn.connection.host}`);
        return conn.connection;
      })
      .catch((err) => {
        connecting = null;
        console.error(`Database Error: ${err.message}`);
        throw err;
      });
  }
  return connecting;
};

module.exports = dbConnect;
