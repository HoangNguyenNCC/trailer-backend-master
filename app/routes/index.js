const userRoutes = require("./userRoutes");
const licenseeRoutes = require("./licenseeRoutes");
const adminRoutes = require("./adminRoutes");

module.exports = (app) => {
  app.use(userRoutes);
  app.use(licenseeRoutes);
  app.use(adminRoutes);
};
