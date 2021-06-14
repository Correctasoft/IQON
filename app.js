const express = require("express");
const app = express();
const path = require("path");
const expresshandelbars = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverrride = require("method-override");
const { mongoDbUrl } = require("./config/database");
const session = require('express-session');
const compression = require("compression");

const refreshTokens = [];

mongoose.Promise = global.Promise;
mongoose
  .connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => {
    console.log("Mongo Connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(__dirname + '/public'));
app.use(session({
  secret: 'ICON-Ecommerce',
  resave: true,
  cookie: {
      maxAge: 60 * 60 * 1000
  },
  saveUninitialized: false
}));

//Set View Engine
const {
  select,
  paginate,
  ifCond,
  add,
  inc,
  isPermitted,
} = require("./helpers/handlebars-helpers");

app.engine(
  "handlebars",
  expresshandelbars({
    defaultLayout: "home",
    helpers: {
      select,
      paginate,
      add,
      inc,
      isPermitted,
      ifCond
    },
  })
);

app.set("view engine", "handlebars");

//Upload middleware
app.use(compression());
//bodye parser
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
  })
);

app.use(
  bodyParser.json({
    limit: "100mb",
    extended: true,
    strict: false,
  })
);

//method override
app.use(methodOverrride("_method"));

//Load Routes
//website pages
const home = require("./routes/PagesController/website/home");
const web_product = require("./routes/PagesController/website/product");
const cart = require("./routes/PagesController/website/cart");
const checkout = require("./routes/PagesController/website/checkout");
const webauth = require("./routes/PagesController/website/authentication");
const webcustomer = require("./routes/PagesController/website/customer");
const shop = require("./routes/PagesController/website/shop");
const sale = require("./routes/PagesController/website/sale");

//website apis
const webcartAPI = require("./routes/APIController/website/cart");
const shopAPI = require("./routes/APIController/website/shop");
const saleAPI = require("./routes/APIController/website/sale");


//admin routes
const pages = require("./routes/PagesController/admin/pages");
const category = require("./routes/PagesController/admin/category");
const salecategory = require("./routes/PagesController/admin/salecategory");
const banner = require("./routes/PagesController/admin/banner");
const outlet = require("./routes/PagesController/admin/outlet");
const product = require("./routes/PagesController/admin/product");
const productimages = require("./routes/PagesController/admin/productimages");
const customer = require("./routes/PagesController/admin/customer");
const order = require("./routes/PagesController/admin/order");
const review = require("./routes/PagesController/admin/review");
const auth = require("./routes/PagesController/admin/authentication");
const quickfix = require("./routes/PagesController/admin/quickfix");

//admin api routes
const categoryAPI = require("./routes/APIController/admin/category");
const salecategoryAPI = require("./routes/APIController/admin/salecategory");
const bannerAPI = require("./routes/APIController/admin/banner");
const outletAPI = require("./routes/APIController/admin/outlet");
const productAPI = require("./routes/APIController/admin/product");
const productImagesAPI = require("./routes/APIController/admin/productimages");
const customerAPI = require("./routes/APIController/admin/customer");
const orderAPI = require("./routes/APIController/admin/order");
const reviewAPI = require("./routes/APIController/admin/review");

//website routes
app.use('/', home);
app.use('/product', web_product);
app.use('/cart', cart);
app.use('/checkout', checkout);
app.use('/auth', webauth);
app.use('/customer', webcustomer);
app.use('/shop', shop);
app.use('/sale', sale);


app.use('/api/cart', webcartAPI);
app.use('/api/shop', shopAPI);
app.use('/api/sale', saleAPI);


//admin routes
app.use('/admin', pages);
app.use('/admin/category', category);
app.use('/admin/salecategory', salecategory);
app.use('/admin/banner', banner);
app.use('/admin/outlet', outlet);
app.use('/admin/product', product);
app.use('/admin/productimages', productimages);
app.use('/admin/customer', customer);
app.use('/admin/order', order);
app.use('/admin/review', review);
app.use('/admin/auth', auth);
app.use('/admin/quickfix', quickfix);


app.use('/admin/api/categories', categoryAPI);
app.use('/admin/api/salecategories', salecategoryAPI);
app.use('/admin/api/banners', bannerAPI);
app.use('/admin/api/outlets', outletAPI);
app.use('/admin/api/products', productAPI);
app.use('/admin/api/productimages', productImagesAPI);
app.use('/admin/api/customers', customerAPI);
app.use('/admin/api/orders', orderAPI);
app.use('/admin/api/reviews', reviewAPI);


app.post('/login', (req, res) => {
  // read username and password from request body
  const { username, password } = req.body;

  // filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
      // generate an access token
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

      refreshTokens.push(refreshToken);
      req.user = user;
      res.json({
          accessToken,
          refreshToken
      });
  } else {
      res.send('Username or password incorrect');
  }
});


app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
      return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
      res.json({
          accessToken
      });
  });
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(token => t !== token);
  res.send("Logout successful");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`listenning on port `, process.env.PORT || 8080);
});




