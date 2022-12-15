const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("../config/swagger.yaml");
const authConfig = require("../config/config.js");

const setup = (app) => {
  swaggerDocument.basePath =
    authConfig.swagger.basePath || swaggerDocument.basePath;
  app.use(
    "/swagger-ui.html",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  );
};
module.exports = setup;
