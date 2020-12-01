const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const productController = require('../controllers/products.controllers');

// get Requests
// router.get("/all-products", productController.get_all_products);
// router.get("/admin-products-query-search", productController.get_admin_products);
router.get("/", productController.getAll);
router.get("/new-arrivals", productController.get_new_arrival);
router.get("/product-by-id/:_id", productController.getSingleProduct);
// router.get("/any/product-by-id/:_id", productController.get_all_product_by_id);

// router.get("/abc/cde/vendor/user-products/:_id", productController.get_vendor_products);
router.get("/user-products-query-search/:_id", productController.get_vendor_product_query_search);

router.get("/search/building-name/abc", productController.get_product_id);

// router.get("/products-all-count/:_id", productController.geteverything);
// router.get("/search/abc", productController.get_search_products);

// router.get("/less-stock/:_id", productController.get_less_stock_products);
// router.get("/vendor-search-less-stock/:_id", productController.get_vendor_product_less_stock_by_id);

router.post("/add", productController.addProduct);


router.put("/:_id", checkAuth, productController.updateProduct);
router.put("/review/abc", productController.add_review);



router.delete("/:_id", checkAuth, productController.deleteProduct);

module.exports = router;


