const slugify = require("slugify");
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");

exports.getBrandValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  validatorMiddleware,
];

exports.createAddressValidator = [
  check("alias")
    .notEmpty()
    .withMessage("alias required")
    .isLength({ max: 32 })
    .withMessage("Too long alias name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("details")
    .notEmpty()
    .withMessage("details required")
    .isLength({ max: 32 })
    .withMessage("Too long details name"),
  check("city")
    .notEmpty()
    .withMessage("city required")
    .isLength({ max: 32 })
    .withMessage("Too long city name"),
  validatorMiddleware,
];

exports.updateAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  check("alias")
    .optional()
    .isLength({ max: 32 })
    .withMessage("Too long alias name")
    .custom((val, { req }) => {
      req.body.slug = slugify(val);
      return true;
    }),
  check("details")
    .optional()
    .isLength({ max: 32 })
    .withMessage("Too long details name"),
  check("city")
    .optional()
    .isLength({ max: 32 })
    .withMessage("Too long city name"),
  validatorMiddleware,
];

exports.deleteAddressValidator = [
  check("id").isMongoId().withMessage("Invalid address id format"),
  validatorMiddleware,
];
