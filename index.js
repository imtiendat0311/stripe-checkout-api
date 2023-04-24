const bodyParser = require('body-parser');
const express = require('express');

var cors = require('cors');
const stripe = require('stripe')("sk_test_51MywnDKL9hIJ3aoFj7ufDEeOXDySBcUCVviuJrMiZ4YlpFH2rEuaum37o3LJtzMmObURLMXa7czeinuY7hGYboLe00i8MtuDVa")
const app = express();
app.use(cors());


app.use(
  bodyParser.json()
);
app.use(
    bodyParser.urlencoded({extended: true})
)
app.post('/api/checkout',async(req, res) =>  {
    let data = req.body;
    console.log(req.body);
    const line =[]
    const cart = JSON.parse(req.body.cart);
    cart.forEach((item) => {
    line.push({
      price_data: {
        currency: "vnd",
        unit_amount: item.price,
        product_data: {
          name: item.kind,
          description: item.desc,
          images: [item.src],
        },
      },
      quantity: item.quantity,
    });
  });
  const session = await stripe.checkout.sessions.create({
    billing_address_collection: "required",
    shipping_address_collection: { allowed_countries: ["US", "VN"] },
    line_items: line,
    mode: "payment",
    customer_creation: "always",
    success_url: `https://bifrost-superboo0311.vercel.app/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `https://bifrost-superboo0311.vercel.app`,
    });
    res.redirect(session.url);

})
app.listen(process.env.PORT || 3000, () => console.log('Server is running on port 3000'));
