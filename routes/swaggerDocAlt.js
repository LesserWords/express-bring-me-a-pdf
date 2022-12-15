const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const options = {
  definition: {
    openapi: "3.0.0",
  },
  apis: ["./routes/*.js"],
};
const specs = swaggerJsdoc(options);
const setup = (app) => {
  app.use("/swagger", swaggerUi.serve, swaggerUi.setup(specs));
};
module.exports = setup;
