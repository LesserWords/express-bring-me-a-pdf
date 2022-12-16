const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require("path");
const swagger_path = path.resolve(__dirname, "../config/swagger.yaml");
const swaggerDocument = YAML.load(swagger_path);
const authConfig = require("../config/config.js");

const setup = (app) => {
  swaggerDocument.basePath =
    authConfig.swagger.basePath || swaggerDocument.basePath;
  app.use("/swagger-ui", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
module.exports = setup;
