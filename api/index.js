const express = require("express");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const logger = require("morgan");
// const swaggerDoc = require("../routes/swaggerDoc");
const config = require("../config/config.js");
const indexrouter = require("../routes/index");

const app = express();
app.set("port", config.properties.appPort || 3000);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  fileUpload({
    createParentPath: true,
    limits: {
      fileSize: 2 * 1024 * 1024 * 1024, //2MB max file(s) size
    },
  })
);

app.use("/", indexrouter);
// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err,
  });
});

// swaggerDoc(app);
app.listen(config.properties.appPort, () =>
  console.log(`Server is running on port ${config.properties.appPort}`)
);
// app.listen(config.properties.appPort, () =>
//   console.log(`Server is running on port ${config.properties.appPort}`)
// );
module.exports = app;
