const router = require("express").Router();

const { newOrder,
        getSingleOrder,
        myOrders,
        allOrders,
        updateOrder,
        deleteOrder } = require("../controllers/orderController");

const {isAuthenticatedUser, authorizedRoles} = require("../middlewares/auth");

router.get("/orders/", isAuthenticatedUser, myOrders);
router.post("/orders/", isAuthenticatedUser, newOrder);
router.get("/orders/:id", isAuthenticatedUser, getSingleOrder);
router.get("/admin/orders", isAuthenticatedUser, authorizedRoles("admin"), allOrders);
router.put("/admin/orders/:id", isAuthenticatedUser, authorizedRoles("admin"), updateOrder);
router.delete("/admin/orders/:id", isAuthenticatedUser, authorizedRoles("admin"), deleteOrder);

module.exports = router;