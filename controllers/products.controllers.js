const productsController = {};
const Products = require("../models/products.model");
const fs = require("fs");
const cloudinary = require("../cloudinary");
const bodyParser = require("body-parser");
// fs.readdirSync(__dirname + "/models").forEach(function (file) {
//   require(__dirname + "/models/" + file);
// });

productsController.add_review = async (req, res) => {
  const body = req.body;
  var datetime = new Date();
  body.entry_date = datetime;

    const products = await Products.update(
      { _id: req.query._id },
      {
        $push: { "reviews": body },
      }
    );
    res.status(200).send({
      code: 200,
      message: "Thank You For Review",
    });
};

productsController.getAll = async (req, res) => {
  try {
    let products = await Products.paginate(
        {},
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        }
      );
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: products,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.addProduct = async (req, res) => {
  try {
    const body = req.body;
    const urls = [];
    const uploader = async (path) => await cloudinary.uploads(path, "Images");
    body.variations = JSON.parse(body.variations)
    const files = req.files;
    for (const file of files) {
      const imagepath = file.path;
      const newPath = await uploader(imagepath);
      urls.push(newPath);
      fs.unlinkSync(imagepath);
    }
    // var count = 0;
    // for (let k = 0; k < body.image_link.length; k++) {
    //   body.image_link[k] = urls[count];
    //   count++;
    // }
    body.image_link1=urls[0];
    body.image_link2=urls[1];
    body.image_link3=urls[2];
    const product = new Products(body);

    const result = await product.save();
    res.status(200).send({
      code: 200,
      message: "Product Added Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res
      .status(500)
      .send({ message: "Product Added Successfully", error });
  }
};


productsController.getSingleProduct = async (req, res) => {
  let product;
  try {
    const _id = req.params._id;
    product = await Products.findOne({ _id: _id });
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_product_id = async (req, res) => {
  let product;
  try {
    const _id = req.params._id;
    product = await Products.find({ building_name: req.query.building_name },{_id:1});
    res.status(200).send({
      code: 200,
      message: "Successful",
      data: product,
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.get_new_arrival = async (req, res) => {
  try {
      var datetime = new Date();
      datetime.setMonth(datetime.getMonth() - 1);

      let products = await Products.paginate(
        {},
        {
          limit: parseInt(req.query.limit),
          page: parseInt(req.query.page),
        }
      );
      res.status(200).send({
        code: 200,
        message: "Successful",
        data: products,
      });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.deleteProduct = async (req, res) => {
  if (!req.params._id) {
    Fu;
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;

    const result = await Products.findOneAndDelete({
      _id: _id,
    });

    res.status(200).send({
      code: 200,
      message: "Deleted Successfully",
    });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

productsController.updateProduct = async (req, res) => {
  if (!req.params._id) {
    res.status(500).send({
      message: "ID missing",
    });
  }
  try {
    const _id = req.params._id;
    let updates = req.body;
    runUpdate(_id, updates, res);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

async function runUpdate(_id, updates, res) {
  try {
    const result = await Products.updateOne(
      {
        _id: _id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    {
      if (result.nModified == 1) {
        res.status(200).send({
          code: 200,
          message: "Updated Successfully",
        });
      } else if (result.upserted) {
        res.status(200).send({
          code: 200,
          message: "Created Successfully",
        });
      } else {
        res.status(422).send({
          code: 422,
          message: "Unprocessible Entity",
        });
      }
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}
async function runUpdateById(id, updates, res) {
  try {
    const result = await products.updateOne(
      {
        id: id,
      },
      {
        $set: updates,
      },
      {
        upsert: true,
        runValidators: true,
      }
    );

    if (result.nModified == 1) {
      res.status(200).send({
        code: 200,
        message: "Updated Successfully",
      });
    } else if (result.upserted) {
      res.status(200).send({
        code: 200,
        message: "Created Successfully",
      });
    } else {
      res.status(200).send({
        code: 200,
        message: "Task completed successfully",
      });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
}

module.exports = productsController;


// const productsController = {};
// const Products = require("../models/product.model");
// const jwt = require("jsonwebtoken");
// const mongoose = require("mongoose");
// const Categories = require("../models/category.model");
// const Sub_categories = require("../models/sub-category.model");

// productsController.add_rating_and_review = async (req, res) => {
//   const body = req.body;
//   var datetime = new Date();
//   body.entry_date = datetime;

//   var search = "";
//   if (body.rating === 1) {
//     search = "one_star";
//   } else if (body.rating === 2) {
//     search = "two_star";
//   } else if (body.rating === 3) {
//     search = "three_star";
//   } else if (body.rating === 4) {
//     search = "four_star";
//   } else if (body.rating === 5) {
//     search = "five_star";
//   }

//   if (!req.query.variation_id) {
//     const products1 = await Products.update(
//       { _id: req.query._id },
//       {
//         $push: { "rating_review.reviews": body },
//         $inc: { [`rating_review.rating.${search}`]: 1 },
//       }
//     );

//     const products2 = await Products.findOne(
//       { _id: req.query._id },
//       { rating_review: 1 }
//     );
//     const one = products2.rating_review.rating.one_star;
//     const two = products2.rating_review.rating.two_star;
//     const three = products2.rating_review.rating.three_star;
//     const four = products2.rating_review.rating.four_star;
//     const five = products2.rating_review.rating.five_star;
//     const up = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;
//     const down = one + two + three + four + five;
//     const overall = up / down;

//     const products3 = await Products.update(
//       { _id: req.query._id },
//       {
//         $set: { "rating_review.rating.overall": overall.toFixed(1) },
//       }
//     );
//     res.status(200).send({
//       code: 200,
//       message: "Thank You For Review And Rating",
//     });
//   } else {
//     const products1 = await Products.update(
//       { _id: req.query._id },
//       {
//         $push: { [`product_variations.$[i].rating_review.reviews`]: body },
//         $inc: { [`product_variations.$[i].rating_review.rating.${search}`]: 1 },
//       },
//       { arrayFilters: [{ "i._id": req.query.variation_id }], multi: true }
//     );
//     const products2 = await Products.find(
//       { _id: req.query._id },
//       { product_variations: 1, _id: 0 }
//     );
//     var one = 0;
//     var two = 0;
//     var three = 0;
//     var four = 0;
//     var five = 0;
//     var up = 0;
//     var down = 0;
//     var overall = 0;
//     var index = req.query.variation_index;

//     products2.forEach((element) => {
//       one = element.product_variations[index].rating_review.rating.one_star;
//       two = element.product_variations[index].rating_review.rating.two_star;
//       three = element.product_variations[index].rating_review.rating.three_star;
//       four = element.product_variations[index].rating_review.rating.four_star;
//       five = element.product_variations[index].rating_review.rating.five_star;
//     });
//     up = one * 1 + two * 2 + three * 3 + four * 4 + five * 5;
//     down = one + two + three + four + five;
//     overall = up / down;

//     const products3 = await Products.update(
//       { _id: req.query._id },
//       {
//         $set: {
//           "product_variations.$[i].rating_review.rating.overall": overall.toFixed(
//             1
//           ),
//         },
//       },
//       { arrayFilters: [{ "i._id": req.query.variation_id }], multi: true }
//     );
//     res.status(200).send({
//       code: 200,
//       message: "Thank You For Review And Rating",
//     });
//   }
// };

// //Add product endpoint definition
// productsController.addProduct = async (req, res) => {
//   const body = req.body;

//   var url;
//   const urls = [];
//   for (const file of req.files) {
//     urls.push({ url: file.location });
//   }

//   try {
//     body.dangerous_goods = JSON.parse(body.dangerous_goods);
//     body.product_tags = JSON.parse(body.product_tags);

//     var datetime = new Date();
//     body.isdeleted = false;
//     body.entry_date = datetime;
//     const header = jwt.decode(req.headers.authorization);
//     body.vendor_id = header.data._id;
//     if (body.product_type === "simple-product") {
//       const body1 = {
//         rating: {
//           one_star: 0,
//           two_star: 0,
//           three_star: 0,
//           four_star: 0,
//           five_star: 0,
//           overall: 0,
//         },
//       };
//       body.rating_review = body1;
//       body.custom_fields = JSON.parse(body.custom_fields);
//       body.product_image_link = urls;
//       body.product_variations = undefined;
//     } else if (body.product_type === "variable-prouct") {
//       body.product_image_link = undefined;
//       body.custom_fields = undefined;
//       body.product_variations = JSON.parse(body.product_variations);
//       var count = 0;
//       for (let index = 0; index < body.product_variations.length; index++) {
//         for (
//           let k = 0;
//           k < body.product_variations[index].image_link.length;
//           k++
//         ) {
//           body.product_variations[index].image_link[k] = urls[count];
//           count++;
//         }
//       }
//     }
//     const product = new Products(body);
//     const result = await product.save();
//     res.status(200).send({
//       code: 200,
//       message: "product Added Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res
//       .status(500)
//       .send({ message: "Product Added Successfully", error });
//   }
// };

productsController.get_all_products_query_search = async (req, res) => {

  var ObjectId = mongoose.Types.ObjectId;
  const _id = new ObjectId(req.params._id);

  const field=req.query.field;
  const search={};
  search[field]=req.query.q;
  try {
    let products = await Products.paginate(
      search,
      {
        limit: parseInt(req.query.limit),
        page: parseInt(req.query.page),
      }
    );
  res.status(200).send({
    code: 200,
    message: "Successful",
    data: products,
  });
  } catch (error) {
    console.log("error", error);
    return res.status(500).send(error);
  }
};

// productsController.get_admin_products = async (req, res) => {
//   console.log("id", req.query);
//   const startdate = req.query.start_date;
//   const enddate = req.query.end_date + "T23:59:59Z";
//   try {
//     if (req.query.field === "category") {
//       let query = {};
//       query = await Categories.findOne({ label: req.query.q }, { _id: 1 });

//       if (!query) {
//         res.status(200).send({
//           code: 200,
//           data: [],
//           total: 0,
//         });
//         return;
//       } else {
//         const total = await Products.countDocuments({
//           category: query._id,
//           // isdeleted: false,
//           entry_date: {
//             $gte: new Date(startdate),
//             $lte: new Date(enddate),
//           },
//         });
//         const products = await Products.aggregate([
//           {
//             $match: {
//               category: query._id,
//               // isdeleted: false,
//               entry_date: {
//                 $gte: new Date(startdate),
//                 $lte: new Date(enddate),
//               },
//             },
//           },
//           {
//             $lookup: {
//               from: "categories",
//               localField: "category",
//               foreignField: "_id",
//               as: "category",
//             },
//           },
//           { $unwind: "$category" },
//           {
//             $lookup: {
//               from: "sub_categories",
//               localField: "sub_category",
//               foreignField: "_id",
//               as: "sub_category",
//             },
//           },
//           { $unwind: "$sub_category" },
//           {
//             $skip: (req.query.page - 1) * req.query.limit,
//           },
//           {
//             $limit: parseInt(req.query.limit),
//           },
//         ]);
//         res.status(200).send({
//           code: 200,
//           message: "Successful",
//           data: products,
//           total,
//         });
//       }
//     } else if (req.query.field === "sub-category") {
//       let query = {};
//       query = await Sub_categories.findOne({ label: req.query.q }, { _id: 1 });
//       if (!query) {
//         res.status(200).send({
//           code: 200,
//           data: [],
//           total: 0,
//         });
//         return;
//       } else {
//         const total = await Products.countDocuments({
//           sub_category: query._id,
//           // isdeleted: false,
//           entry_date: {
//             $gte: new Date(startdate),
//             $lte: new Date(enddate),
//           },
//         });
//         const products = await Products.aggregate([
//           {
//             $match: {
//               sub_category: query._id,
//               // isdeleted: false,
//               entry_date: {
//                 $gte: new Date(startdate),
//                 $lte: new Date(enddate),
//               },
//             },
//           },
//           {
//             $lookup: {
//               from: "categories",
//               localField: "category",
//               foreignField: "_id",
//               as: "category",
//             },
//           },
//           { $unwind: "$category" },
//           {
//             $lookup: {
//               from: "sub_categories",
//               localField: "sub_category",
//               foreignField: "_id",
//               as: "sub_category",
//             },
//           },
//           { $unwind: "$sub_category" },
//           {
//             $skip: (req.query.page - 1) * req.query.limit,
//           },
//           {
//             $limit: parseInt(req.query.limit),
//           },
//         ]);
//         res.status(200).send({
//           code: 200,
//           message: "Successful",
//           data: products,
//           total,
//         });
//       }
//     } else if (req.query.field === "_id") {
//       var ObjectId = mongoose.Types.ObjectId;
//       let _id = 0;
//       try {
//         _id = new ObjectId(req.query.q);
//       } catch (err) {
//         res.status(200).send({
//           code: 200,
//           message: "Successful",
//           data: [],
//           total: 0,
//         });
//         return;
//       }

//       const field = req.query.field;
//       const search = {};
//       search[field] = _id;
//       search["entry_date"] = {
//         $gte: new Date(startdate),
//         $lte: new Date(enddate),
//       };
//       const total = await Products.countDocuments(search);
//       const products = await Products.aggregate([
//         {
//           $match: search,
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "category",
//             foreignField: "_id",
//             as: "category",
//           },
//         },
//         { $unwind: "$category" },
//         {
//           $lookup: {
//             from: "sub_categories",
//             localField: "sub_category",
//             foreignField: "_id",
//             as: "sub_category",
//           },
//         },
//         { $unwind: "$sub_category" },
//         {
//           $skip: (req.query.page - 1) * req.query.limit,
//         },
//         {
//           $limit: parseInt(req.query.limit),
//         },
//       ]);
//       res.status(200).send({
//         code: 200,
//         message: "Successful",
//         data: products,
//         total,
//       });
//     } else {
//       const entry_date = "entry_date";

//       const field = req.query.field;
//       const search = {};
//       search[field] = req.query.q;
//       search[entry_date] = {
//         $gte: new Date(startdate),
//         $lte: new Date(enddate),
//       };
//       const total = await Products.countDocuments(search);
//       const products = await Products.aggregate([
//         {
//           $match: search,
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "category",
//             foreignField: "_id",
//             as: "category",
//           },
//         },
//         { $unwind: "$category" },
//         {
//           $lookup: {
//             from: "sub_categories",
//             localField: "sub_category",
//             foreignField: "_id",
//             as: "sub_category",
//           },
//         },
//         { $unwind: "$sub_category" },
//         {
//           $skip: (req.query.page - 1) * req.query.limit,
//         },
//         {
//           $limit: parseInt(req.query.limit),
//         },
//       ]);
//       res.status(200).send({
//         code: 200,
//         message: "Successful",
//         data: products,
//         total,
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_customer_side_products = async (req, res) => {
//   try {
//     if (req.query.q === "new-arrival") {
//       var datetime = new Date();
//       datetime.setMonth(datetime.getMonth() - 1);
//       const total = await Products.countDocuments({
//         isdeleted: false,
//       });
//       const products = await Products.aggregate([
//         {
//           $match: {
//             isdeleted: false,
//           },
//         },
//         {
//           $lookup: {
//             from: "categories",
//             localField: "category",
//             foreignField: "_id",
//             as: "category",
//           },
//         },
//         { $unwind: "$category" },
//         {
//           $lookup: {
//             from: "sub_categories",
//             localField: "sub_category",
//             foreignField: "_id",
//             as: "sub_category",
//           },
//         },
//         { $unwind: "$sub_category" },
//         {
//           $skip: (req.query.page - 1) * req.query.limit,
//         },
//         {
//           $limit: parseInt(req.query.limit),
//         },
//       ]);
//       res.status(200).send({
//         code: 200,
//         message: "Successful",
//         data: products,
//         total,
//       });
//     } else if (req.query.field === "category") {
//       let query = {};
//       query = await Categories.findOne({ label: req.query.q }, { _id: 1 });

//       if (!query) {
//         res.status(200).send({
//           code: 200,
//           data: [],
//           total: 0,
//         });
//         return;
//       } else {
//         const total = await Products.countDocuments({
//           category: query._id,
//           isdeleted: false,
//         });
//         const products = await Products.aggregate([
//           {
//             $match: {
//               category: query._id,
//               isdeleted: false,
//             },
//           },
//           {
//             $lookup: {
//               from: "categories",
//               localField: "category",
//               foreignField: "_id",
//               as: "category",
//             },
//           },
//           { $unwind: "$category" },
//           {
//             $lookup: {
//               from: "sub_categories",
//               localField: "sub_category",
//               foreignField: "_id",
//               as: "sub_category",
//             },
//           },
//           { $unwind: "$sub_category" },
//           {
//             $skip: (req.query.page - 1) * req.query.limit,
//           },
//           {
//             $limit: parseInt(req.query.limit),
//           },
//         ]);
//         res.status(200).send({
//           code: 200,
//           message: "Successful",
//           data: products,
//           total,
//         });
//       }
//     } else if (req.query.field === "sub-category") {
//       let query = {};
//       query = await Sub_categories.findOne({ label: req.query.q }, { _id: 1 });
//       if (!query) {
//         res.status(200).send({
//           code: 200,
//           data: [],
//           total: 0,
//         });
//         return;
//       } else {
//         const total = await Products.countDocuments({
//           sub_category: query._id,
//           isdeleted: false,
//         });
//         const products = await Products.aggregate([
//           {
//             $match: {
//               sub_category: query._id,
//               isdeleted: false,
//             },
//           },
//           {
//             $lookup: {
//               from: "categories",
//               localField: "category",
//               foreignField: "_id",
//               as: "category",
//             },
//           },
//           { $unwind: "$category" },
//           {
//             $lookup: {
//               from: "sub_categories",
//               localField: "sub_category",
//               foreignField: "_id",
//               as: "sub_category",
//             },
//           },
//           { $unwind: "$sub_category" },
//           {
//             $skip: (req.query.page - 1) * req.query.limit,
//           },
//           {
//             $limit: parseInt(req.query.limit),
//           },
//         ]);
//         res.status(200).send({
//           code: 200,
//           message: "Successful",
//           data: products,
//           total,
//         });
//       }
//     }
//     // } else if (req.query.field === '_id') {
//     //   var ObjectId = mongoose.Types.ObjectId;
//     //   let _id = 0;
//     //   try {
//     //     _id = new ObjectId(req.query.q);
//     //   } catch (err) {
//     //     res.status(200).send({
//     //       code: 200,
//     //       message: "Successful",
//     //       data: [],
//     //       total: 0,
//     //     });
//     //     return
//     //   }
//     //   const entry_date = "entry_date";

//     //   const field = req.query.field;
//     //   const search = {};
//     //   search[field] = _id;
//     //   search[entry_date] = { $gte: new Date(startdate), $lte: new Date(enddate) };
//     //   const total = await Products.countDocuments(search);
//     //   const products = await Products.aggregate([
//     //     {
//     //       $match: search,
//     //     },
//     //     {
//     //       $lookup: {
//     //         from: "categories",
//     //         localField: "category",
//     //         foreignField: "_id",
//     //         as: "category",
//     //       },
//     //     },
//     //     { $unwind: "$category" },
//     //     {
//     //       $lookup: {
//     //         from: "sub_categories",
//     //         localField: "sub_category",
//     //         foreignField: "_id",
//     //         as: "sub_category",
//     //       },
//     //     },
//     //     { $unwind: "$sub_category" },
//     //     {
//     //       $skip: (req.query.page - 1) * req.query.limit,
//     //     },
//     //     {
//     //       $limit: parseInt(req.query.limit),
//     //     },
//     //   ]);
//     //   res.status(200).send({
//     //     code: 200,
//     //     message: "Successful",
//     //     data: products,
//     //     total,
//     //   });
//     // }
//     // else {
//     //   const entry_date = "entry_date";

//     //   const field = req.query.field;
//     //   const search = {};
//     //   search[field] = req.query.q;
//     //   search[entry_date] = { $gte: new Date(startdate), $lte: new Date(enddate) };
//     //   const total = await Products.countDocuments(search);
//     //   const products = await Products.aggregate([
//     //     {
//     //       $match: search,
//     //     },
//     //     {
//     //       $lookup: {
//     //         from: "categories",
//     //         localField: "category",
//     //         foreignField: "_id",
//     //         as: "category",
//     //       },
//     //     },
//     //     { $unwind: "$category" },
//     //     {
//     //       $lookup: {
//     //         from: "sub_categories",
//     //         localField: "sub_category",
//     //         foreignField: "_id",
//     //         as: "sub_category",
//     //       },
//     //     },
//     //     { $unwind: "$sub_category" },
//     //     {
//     //       $skip: (req.query.page - 1) * req.query.limit,
//     //     },
//     //     {
//     //       $limit: parseInt(req.query.limit),
//     //     },
//     //   ]);
//     //   res.status(200).send({
//     //     code: 200,
//     //     message: "Successful",
//     //     data: products,
//     //     total,
//     //   });
//     // }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_all_products = async (req, res) => {
//   try {
//     const total = await Products.countDocuments({
//       isdeleted: false,
//     });
//     const products = await Products.aggregate([
//       {
//         $match: {
//           isdeleted: false,
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//       {
//         $skip: (req.query.page - 1) * req.query.limit,
//       },
//       {
//         $limit: parseInt(req.query.limit),
//       },
//     ]);
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: products,
//       total,
//     });
//   } catch (error) {
//     return res.status(500).send(error);
//   }
// };

// productsController.get_product_by_id = async (req, res) => {
//   try {
//     var ObjectId = mongoose.Types.ObjectId;
//     const _id = new ObjectId(req.params._id);
//     const products = await Products.aggregate([
//       {
//         $match: {
//           _id: _id,
//           isdeleted: false,
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//     ]);
//     if (products.length) {
//       res.status(200).send({
//         code: 200,
//         message: "Successful",
//         data: products,
//       });
//     } else {
//       res.status(500).send({
//         code: 500,
//         message: "This Product Does Not Exists",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_all_product_by_id = async (req, res) => {
//   try {
//     var ObjectId = mongoose.Types.ObjectId;
//     const _id = new ObjectId(req.params._id);
//     const products = await Products.aggregate([
//       {
//         $match: {
//           _id: _id,
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//     ]);
//     if (products.length) {
//       res.status(200).send({
//         code: 200,
//         message: "Successful",
//         data: products,
//       });
//     } else {
//       res.status(500).send({
//         code: 500,
//         message: "This Product Does Not Exists",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// // {
// //   $project: {
// //     product_name: 1,
// //     product_type: 1,
// //     product_weight: 1,
// //     value: "$category.value",
// //     label: "$category.label",
// //   },
// // },

// //Get All Products of specific vendor endpoint definition
//  productsController.get_vendor_products = async (req, res) => {
//   try {
//     var ObjectId = mongoose.Types.ObjectId;
//     const _id = new ObjectId(req.params._id);
//     const total = await Products.countDocuments({
//       vendor_id: _id,
//       isdeleted: false,
//     });
//     const products = await Products.aggregate([
//       {
//         $match: {
//           vendor_id: _id,
//           isdeleted: false,
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//       {
//         $skip: (req.query.page - 1) * req.query.limit,
//       },
//       {
//         $limit: parseInt(req.query.limit),
//       },
//       // {
//       //   $project: {
//       //     product_name: 1,
//       //     product_type: 1,
//       //     product_weight: 1,
//       //     value: "$category.value",
//       //     label: "$category.label",
//       //   },
//       // },
//     ]);
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: products,
//       total,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// // productsController.bulkupload = async (req, res) => {
// //   console.log("Check:",req.body);
// //   var datetime = new Date();
// //   var date=datetime.toISOString().slice(0,10);
// //     // const body = req.body;
// //     // req.body.product_entry_date=date;
// //   try {
// //     var ws = wb.Sheets["Worksheet"];
// //     var data = xlsx.utils.sheet_to_json(ws);

// //     data.forEach(element => {
// //       element.product_entry_date=date;
// //       const product = new Products(element);
// //       product.save();
// //     });
// //     res.status(200).send({
// //       code: 200,
// //       message: "Product Added Successfully"
// //     });
// //   } catch (error) {
// //     console.log("error", error);
// //     return res
// //       .status(500)
// //       .send({ message: "Product Added Successfully", error });
// //   }
// // };

// productsController.getSingleProduct = async (req, res) => {
//   let product;
//   try {
//     const _id = req.params._id;
//     product = await products.findOne({ _id: _id });
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       product,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.deleteProduct = async (req, res) => {
//   if (!req.params._id) {
//     Fu;
//     res.status(500).send({
//       message: "ID missing",
//     });
//   }
//   try {
//     const _id = req.params._id;
//     Products.findOneAndUpdate(
//       { _id: _id },
//       {
//         $set: { isdeleted: true },
//       },
//       {
//         returnNewDocument: true,
//       },
//       function (error, result) {
//         res.status(200).send({
//           code: 200,
//           message: "Deleted Successfully",
//         });
//       }
//     );
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.updateProduct = async (req, res) => {
//   if (!req.params._id) {
//     res.status(500).send({
//       message: "ID missing",
//     });
//   }
//   try {
//     const _id = req.params._id;
//     let updates = req.body;
//     runUpdate(_id, updates, res);
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// async function runUpdate(_id, updates, res) {
//   try {
//     const result = await Products.updateOne(
//       {
//         _id: _id,
//       },
//       {
//         $set: updates,
//       },
//       {
//         upsert: true,
//         runValidators: true,
//       }
//     );

//     {
//       if (result.nModified == 1) {
//         res.status(200).send({
//           code: 200,
//           message: "Updated Successfully",
//         });
//       } else if (result.upserted) {
//         res.status(200).send({
//           code: 200,
//           message: "Created Successfully",
//         });
//       } else {
//         res.status(422).send({
//           code: 422,
//           message: "Unprocessible Entity",
//         });
//       }
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// }
// async function runUpdateById(id, updates, res) {
//   try {
//     const result = await products.updateOne(
//       {
//         id: id,
//       },
//       {
//         $set: updates,
//       },
//       {
//         upsert: true,
//         runValidators: true,
//       }
//     );

//     if (result.nModified == 1) {
//       res.status(200).send({
//         code: 200,
//         message: "Updated Successfully",
//       });
//     } else if (result.upserted) {
//       res.status(200).send({
//         code: 200,
//         message: "Created Successfully",
//       });
//     } else {
//       res.status(200).send({
//         code: 200,
//         message: "Task completed successfully",
//       });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// }

// productsController.get_total_products = async (req, res) => {
//   let products;
//   try {
//     products = await Products.paginate();
//     const count = products.total;
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       count,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_total_sold = async (req, res) => {
//   let products;
//   var count = 0;
//   try {
//     products = await Products.paginate();
//     var come = products.docs;

//     come.forEach((element) => {
//       count = count + element.product_in_stock;
//     });
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       count,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.geteverything = async (req, res) => {
//   var ObjectId = mongoose.Types.ObjectId;
//   const _id = new ObjectId(req.params._id);

//   const product0 = await Products.paginate({
//     vendor_id: req.params._id,
//   });
//   const product1 = await Products.aggregate([
//     {
//       $match: {
//         product_in_stock: { $gt: 0 },
//         vendor_id: _id,
//         product_type: "simple-product",
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         _id: 0,
//       },
//     },
//   ]);
//   const product2 = await Products.aggregate([
//     {
//       $match: {
//         product_type: "variable-prouct",
//         vendor_id: _id,
//       },
//     },
//     {
//       $unwind: "$product_variations",
//     },
//     {
//       $match: {
//         "product_variations.stock": { $gt: 0 },
//       },
//     },
//     {
//       $group: {
//         _id: "null",
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: { _id: 0 },
//     },
//   ]);
//   const total_products = product0.total;
//   const in_stock_products = product1[0].count + product2[0].count;
//   console.log("total Products", total_products);
//   console.log("total stock", in_stock_products);
//   res.status(200).send({
//     code: 200,
//     message: "ok",
//     total_products,
//     in_stock_products,
//   });
//   // {
//   //   $project: {
//   //     product_variations: {
//   //        $filter: {
//   //           input: "$product_variations",
//   //           as: "item",
//   //           cond: { $gt: [ "$$item.stock", 0 ] },
//   //        }
//   //     }
//   //  }
//   // },
// };

// productsController.get_search_products = async (req, res) => {
//   const query = req.query.q;
//   var regex = new RegExp(["^", query, "$"].join(""), "i");

//   let actual_products=0;
//   let products1 = 0;
//   let products2 = 0;
//   let products3 = 0;
//   let products4 = 0;
//   let set = 0;
//   try {
//     const products = await Products.paginate(
//       { product_name: regex,isdeleted:false },
//       {
//         limit: parseInt(req.query.limit),
//         page: parseInt(req.query.page),
//       }
//     );
//     if (products.total > 0) {
//       console.log("1");
//       actual_products = products;
//     }
//     if (products.total === 0) {
//       console.log("2");
//       category = await Categories.find({ value: regex }, { _id: 1 });
//       if (category.length > 0) {
//         console.log("3");
//         products1 = await Products.paginate(
//           { category: category[0]._id, isdeleted:false },
//           {
//             limit: parseInt(req.query.limit),
//             page: parseInt(req.query.page),
//           }
//         );
//         if (products1.total > 0) {
//           console.log("4");
//           actual_products = products1;
//         } else {
//           console.log("5");
//           set = 1;
//         }
//       } else {
//         console.log("6");
//         set = 1;
//       }
//     }

//     if (set === 1) {
//       console.log("7");

//       sub_category = await Sub_categories.find({ value: regex }, { _id: 1 });
//       if (sub_category.length > 0) {
//         console.log("8");
//         products2 = await Products.paginate(
//           { sub_category: sub_category[0]._id,isdeleted:false },
//           {
//             limit: parseInt(req.query.limit),
//             page: parseInt(req.query.page),
//           }
//         );
//         if (products2.total > 0) {
//           console.log("9");
//           actual_products = products2;
//         } else {
//           console.log("10");
//           set = 2;
//         }
//       } else {
//         console.log("11");
//         set = 2;
//       }
//     }

//     if (set === 2) {
//       console.log("12");
//       products3 = await Products.paginate(
//         { product_name: new RegExp(query, "i"),isdeleted:false },
//         {
//           limit: parseInt(req.query.limit),
//           page: parseInt(req.query.page),
//         }
//       );
//       if (products3.total > 0) {
//         console.log("13");
//         actual_products = products3;
//       } else {
//         console.log("14");
//         set = 3;
//       }
//     }

//     if (set === 3) {
//       console.log("15");
//       products4 = await Products.paginate(
//         { "product_tags.label": regex,isdeleted:false },
//         {
//           limit: parseInt(req.query.limit),
//           page: parseInt(req.query.page),
//         }
//       );
//       if (products4.total > 0) {
//         console.log("16");
//         actual_products = products4;
//       } else {
//         console.log("17");
//         actual_products = products4;
//       }
//     }

//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: actual_products,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_less_stock_products = async (req, res) => {
//   let simple_total;
//   let simple_product;
//   let variable_total;
//   let variable_product;

//   var ObjectId = mongoose.Types.ObjectId;
//   let _id;
//   try {
//     _id = new ObjectId(req.params._id);
//   } catch (err) {
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: [],
//       total: 0,
//     });
//     return;
//   }
//   try {
//     simple_total = await Products.countDocuments({
//       vendor_id: _id,
//       product_type: "simple-product",
//       isdeleted: false,
//       product_in_stock: { $lt: 5 },
//     });

//     simple_product = await Products.aggregate([
//       {
//         $match: {
//           vendor_id: _id,
//           product_type: "simple-product",
//           isdeleted: false,
//           product_in_stock: { $lt: 5 },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//       {
//         $skip: (req.query.page - 1) * req.query.limit,
//       },
//       {
//         $limit: parseInt(req.query.limit),
//       },
//     ]);

//     variable_total = await Products.countDocuments({
//       vendor_id: _id,
//       product_type: "variable-prouct",
//       isdeleted: false,
//       "product_variations.stock": { $lt: 5 },
//     });

//     variable_product = await Products.aggregate([
//       {
//         $match: {
//           vendor_id: _id,
//           product_type: "variable-prouct",
//           isdeleted: false,
//           "product_variations.stock": { $lt: 5 },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//       {
//         $skip: (req.query.page - 1) * req.query.limit,
//       },
//       {
//         $limit: parseInt(req.query.limit),
//       },
//     ]);
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       simple_product,
//       simple_total,
//       variable_product,
//       variable_total,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.get_vendor_product_less_stock_by_id = async (req, res) => {
//   let simple_total;
//   let simple_product;
//   let variable_total;
//   let variable_product;

//   var ObjectId = mongoose.Types.ObjectId;
//   let _id;
//   let id;
//   try {
//     _id = new ObjectId(req.params._id);
//     id = new ObjectId(req.query.q);
//   } catch (err) {
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       data: [],
//       total: 0,
//     });
//     return;
//   }
//   try {
//     simple_total = await Products.countDocuments({
//       _id: id,
//       vendor_id: _id,
//       product_type: "simple-product",
//       isdeleted: false,
//       product_in_stock: { $lt: 5 },
//     });

//     simple_product = await Products.aggregate([
//       {
//         $match: {
//           _id: id,
//           vendor_id: _id,
//           product_type: "simple-product",
//           isdeleted: false,
//           product_in_stock: { $lt: 5 },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//     ]);

//     variable_total = await Products.countDocuments({
//       _id: id,
//       vendor_id: _id,
//       product_type: "variable-prouct",
//       isdeleted: false,
//       "product_variations.stock": { $lt: 5 },
//     });

//     variable_product = await Products.aggregate([
//       {
//         $match: {
//           _id: id,
//           vendor_id: _id,
//           product_type: "variable-prouct",
//           isdeleted: false,
//           "product_variations.stock": { $lt: 5 },
//         },
//       },
//       {
//         $lookup: {
//           from: "categories",
//           localField: "category",
//           foreignField: "_id",
//           as: "category",
//         },
//       },
//       { $unwind: "$category" },
//       {
//         $lookup: {
//           from: "sub_categories",
//           localField: "sub_category",
//           foreignField: "_id",
//           as: "sub_category",
//         },
//       },
//       { $unwind: "$sub_category" },
//     ]);
//     res.status(200).send({
//       code: 200,
//       message: "Successful",
//       simple_product,
//       simple_total,
//       variable_product,
//       variable_total,
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.update_product_data = async (req, res) => {

//   const body = req.body;
//   try {
//     const _id = req.params._id;
//     Products.findOneAndUpdate(
//       { _id: _id },
//       {
//         $set: body ,
//       },
//       {
//         returnNewDocument: true,
//       },
//       function (error, result) {
//         res.status(200).send({
//           code: 200,
//           message: "updated Successfully",
//         });
//       }
//     );
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// productsController.update_product_variation_data = async (req, res) => {
//   const body = req.body;
//   try {
//     const product = await Products.findOneAndUpdate(
//       { "product_variations._id": req.query.variation_id },
//       {
//         $set: {
//           ["product_variations.$[i].price"]: body.price,
//           ["product_variations.$[i].stock"]: body.stock,
//           ["product_variations.$[i].discount"]: body.discount,
//         },
//       },
//       {
//         arrayFilters: [{ "i._id": req.query.variation_id }],
//         multi: true,
//       }
//     );
//     res.status(200).send({
//       code: 200,
//       message: "updated Successfully",
//     });
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).send(error);
//   }
// };

// module.exports = productsController;
