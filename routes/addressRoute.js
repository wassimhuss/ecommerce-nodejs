const express = require("express");

const authService = require("../services/authService");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
  editAddress,
  getLoggedUserData,
} = require("../services/addressService");
const {
  updateAddressValidator,
  createAddressValidator,
} = require("../utils/validators/addressValidator");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router
  .route("/")
  .post(createAddressValidator, addAddress)
  .get(getLoggedUserAddresses);

router.route("/:itemId").put(updateAddressValidator, editAddress);
router.delete("/:addressId", removeAddress);

module.exports = router;
