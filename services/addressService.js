const asyncHandler = require("express-async-handler");

const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
// @desc    Add address to user addresses list
// @route   POST /api/v1/addresses
// @access  Protected/User
exports.addAddress = asyncHandler(async (req, res, next) => {
  const Useraddresses = await User.findById(req.user._id);
  // $addToSet => add address object to user addresses  array if address not exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true }
  );
  if (Useraddresses.addresses.length == user.addresses.length) {
    return next(
      new ApiError(`error while adding address! please try again later`, 404)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Address added successfully.",
    data: user.addresses,
  });
});
// @desc    Edit address to user addresses list
// @route   PUT /api/v1/addresses
// @access  Protected/User
exports.editAddress = asyncHandler(async (req, res, next) => {
  const { alias, details, phone, city, postcode } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(
      new ApiError(`there is no user for this id ${req.user._id}`, 404)
    );
  }
  const itemIndex = user.addresses.findIndex(
    (item) => item._id.toString() === req.params.itemId
  );
  if (itemIndex > -1) {
    const addressItem = user.addresses[itemIndex];
    addressItem.alias = alias;
    addressItem.details = details;
    addressItem.phone = phone;
    addressItem.city = city;
    addressItem.postcode = postcode;
    user.addresses[itemIndex] = addressItem;
  } else {
    return next(
      new ApiError(`there is no address for this id :${req.params.itemId}`, 404)
    );
  }
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Address edited successfully.",
    data: user.addresses,
  });
});

// @desc    Remove address from user addresses list
// @route   DELETE /api/v1/addresses/:addressId
// @access  Protected/User
exports.removeAddress = asyncHandler(async (req, res, next) => {
  const Useraddresses = await User.findById(req.user._id);
  // $pull => remove address object from user addresses array if addressId exist
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: { _id: req.params.addressId } },
    },
    { new: true }
  );
  if (Useraddresses.addresses.length == user.addresses.length) {
    return next(
      new ApiError(
        `there is no address for this id :${req.params.addressId}`,
        404
      )
    );
  }
  res.status(200).json({
    status: "success",
    message: "Address removed successfully.",
    data: user.addresses,
  });
});

// @desc    Get logged user addresses list
// @route   GET /api/v1/addresses
// @access  Protected/User
exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("addresses");

  res.status(200).json({
    status: "success",
    results: user.addresses.length,
    data: user.addresses,
  });
});
