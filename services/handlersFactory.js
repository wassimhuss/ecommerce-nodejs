const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const fs = require("fs");
exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const oldProduct = await Model.findOne({ _id: req.params.id });

    //desc :  logic to delete product Images from the server.

    if (oldProduct.images) {
      //delete product images array
      let imagesArr = [];
      oldProduct.images.forEach((image) =>
        imagesArr.push(image.split("http://localhost:8000/")[1])
      );
      imagesArr.forEach((image) =>
        fs.unlink("C://projects/ecommerce-apis/uploads/" + image, (err) => {
          if (err) {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
          } else {
            console.info(`removed`);
          }
        })
      );

      // desc : delete product cover image
      const oldCoverImage = oldProduct.imageCover.split(
        "http://localhost:8000/"
      )[1];
      console.log(oldCoverImage);
      fs.unlink(
        "C://projects/ecommerce-apis/uploads/" + oldCoverImage,
        (err) => {
          if (err) {
            // file doens't exist
            console.info("File doesn't exist, won't remove it.");
          } else {
            console.info(`removed`);
          }
        }
      );
    }

    //desc:  logic to delete brand / category image from th server
    if (oldProduct.image) {
      const oldImage = oldProduct.image.split("http://localhost:8000/")[1];
      fs.unlink("C://projects/ecommerce-apis/uploads/" + oldImage, (err) => {
        if (err) {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
        } else {
          console.info(`removed`);
        }
      });
    }

    const document = await Model.findByIdAndDelete(req.params.id);
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(204).send();
  });
exports.deleteSpecificImg = (Model, modelName) =>
  asyncHandler(async (req, res, next) => {
    const object = await Model.findOne({ _id: req.params.id });
    if (object.image) {
      const image = object.image.split("http://localhost:8000/")[1];
      fs.unlink("C://projects/ecommerce-apis/uploads/" + image, (err) => {
        if (err) {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
          next(
            new ApiError(
              `No image for this ${modelName} id ${req.params.id}`,
              404
            )
          );
        } else {
          console.info(req.body);
          Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
          });
          console.info(`removed`);
          res.status(200).json({
            result: 1,
            message: "image has been removed successfully",
          });
        }
      });
    }
    if (object.imageCover) {
      const image = object.imageCover.split("http://localhost:8000/")[1];
      fs.unlink("C://projects/ecommerce-apis/uploads/" + image, (err) => {
        if (err) {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
          next(
            new ApiError(
              `No image for this ${modelName} id ${req.params.id}`,
              404
            )
          );
        } else {
          console.info(`removed`);
          res.status(200).json({
            result: 1,
            message: "image has been removed successfully",
          });
        }
      });
    }
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const oldProduct = await Model.findOne({ _id: req.params.id });

    if (oldProduct.image && req.file) {
      const oldImage = oldProduct.image.split("http://localhost:8000/")[1];
      fs.unlink("C://projects/ecommerce-apis/uploads/" + oldImage, (err) => {
        if (err) {
          // file doens't exist
          console.info("File doesn't exist, won't remove it.");
        } else {
          console.info(`removed`);
        }
      });
    }

    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ data: document });
  });
exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDoc = await Model.create(req.body);
    res.status(201).json({ data: newDoc });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findById(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(200).json({ data: document });
  });

exports.getAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filterObj) {
      filter = req.filterObj;
    }
    // Build query
    const documentsCounts = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(documentsCounts)
      .filter()
      .search(modelName)
      .limitFields()
      .sort();

    // Execute query
    const { mongooseQuery, paginationResult } = apiFeatures;
    const documents = await mongooseQuery;

    res
      .status(200)
      .json({ results: documents.length, paginationResult, data: documents });
  });
