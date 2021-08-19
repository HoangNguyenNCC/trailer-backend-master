const customerUserController = require("./customer/user");
const customerTrailerController = require("./customer/trailers");
const licenseeTrailerController = require("./licensee/trailers");
const licenseeUserController = require("./licensee/user");
const adminCustomerController = require("./admin/customers");
const adminLicenseeController = require("./admin/licensees");
const adminTrailerController = require("./admin/trailers");
const adminUserController = require("./admin/users");

module.exports = {
  customerUserController,
  customerTrailerController,
  licenseeTrailerController,
  licenseeUserController,
  adminCustomerController,
  adminLicenseeController,
  adminTrailerController,
  adminUserController,
};
