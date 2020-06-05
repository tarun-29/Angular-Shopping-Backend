const express = require("express");
const router = express.Router();
const { database } = require("../config/helper");

//get all orders
router.get("/", (req, res) => {
  database
    .table("orders_details as od")
    .join([
      { table: "orders as o", on: "o.id = od.order_id" },
      { table: "products as p", on: "p.id = od.product_id" },
      { table: "users as u", on: "u.id = o.user_id" }
    ])
    .withFields([
      "o.id",
      "p.title as name",
      "p.description",
      "p.price",
      "u.username"
    ])
    .sort({ id: 0.1 })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: "No order found" });
      }
    })
    .catch(err => console.log(err));
});

//get single orde
router.get("/:id", (req, res) => {
  const orderId = req.params.id;
  database
    .table("orders_details as od")
    .join([
      { table: "orders as o", on: "o.id = od.order_id" },
      { table: "products as p", on: "p.id = od.product_id" },
      { table: "users as u", on: "u.id = o.user_id" }
    ])
    .withFields([
      "o.id",
      "p.title as name",
      "p.description",
      "p.price",
      "u.username"
    ])
    .filter({ "o.id": orderId })
    .getAll()
    .then(orders => {
      if (orders.length > 0) {
        res.status(200).json(orders);
      } else {
        res.json({ message: `No order found with order id ${orderId}` });
      }
    })
    .catch(err => console.log(err));
});

//place a new order
router.post("/new", async (req, res) => {
  let { userId, products } = req.body;
  console.log(userId, products);
  if (userId != null && userId > 0 ) {
    database
      .table("orders")
      .insert({
        user_id: userId
      })
      .then(newOrderId => {
        if (newOrderId > 0) {
          products.forEach(async p => {
            let data = await database
              .table("products")
              .filter({ id: p.id })
              .withFields(["quantity"])
              .get();
            let inCart = p.incart;
            if (data.quantity > 0) {
              data.quantity = data.quantity - incart;
              if (data.quantity < 0) {
                data.quantity = 0;
              }
            } else {
              data.quantity = 0;
            }
            // Insert order details w.r.t the newly created order Id
            database.table('order_details')
            .insert({
                order_id : newOrderId,
                product_id: p_id,
                quantity: incart
            })
            .then((newId)=>{
                database.table('products')
                .filter({id: p.id})
                .update({
                    quantity: data.quantity
                })
                .then(sucessNum=>{})
                .catch(err=>console.logE(err));
            })
            .catch(err=>console.log(err));
          });
        }
        else{
            res.json({message: "new order failed while adding order details",success: false})
        }
        res.json({
            message: `Order successfully placed with orderid ${newOrderId}`,
            success: true,
            orderId: newOrderId,
            products: products
        })
      })
      .catch(err => console.log(err));
  }
  else{
      res.json({
          message: `New order failed`,
          success: false
      })
  }
});

//fake payment gateway
router.post('/payment',(req, res)=>{
    setTimeout(()=>{
        res.status(200).json({success: true});
    },3000)
})

module.exports = router;