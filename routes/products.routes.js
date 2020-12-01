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
<<<<<<< HEAD

router.get("/search/building-name/abc", productController.get_product_id);
=======
>>>>>>> e84125f03350b516684a420ed968d2962ed5aaa3

// router.get("/products-all-count/:_id", productController.geteverything);
// router.get("/search/abc", productController.get_search_products);

// router.get("/less-stock/:_id", productController.get_less_stock_products);
// router.get("/vendor-search-less-stock/:_id", productController.get_vendor_product_less_stock_by_id);

router.post("/add", productController.addProduct);


router.put("/:_id", checkAuth, productController.updateProduct);
<<<<<<< HEAD
router.put("/review/abc", productController.add_review);
=======
router.put("/review", checkAuth, productController.add_review);
>>>>>>> e84125f03350b516684a420ed968d2962ed5aaa3



router.delete("/:_id", checkAuth, productController.deleteProduct);

module.exports = router;


