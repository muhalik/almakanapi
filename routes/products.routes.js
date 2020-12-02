const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products.controllers');

// get Requests

router.get("/", productController.getAll);
router.get("/new-arrivals", productController.get_new_arrival);
router.get("/product-by-id/:_id", productController.getSingleProduct);
router.get("/all-products/query-search",productController.get_all_products_query_search);
router.get("/all-vendor-products/query-search",productController.get_all_vendor_products_query_search);
// router.get("/any/product-by-id/:_id", productController.get_all_product_by_id);

// router.get("/abc/cde/vendor/user-products/:_id", productController.get_vendor_products);

router.get("/search/building-name/abc", productController.get_product_id);


router.post("/add", productController.addProduct);


router.put("/:_id", checkAuth, productController.updateProduct);
router.put("/review/abc", productController.add_review);


router.delete("/:_id", checkAuth, productController.deleteProduct);

module.exports = router;


