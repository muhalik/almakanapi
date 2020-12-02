const express = require('express');
const app = express();
const http = require('http');
const multer = require("multer");
const server = http.createServer(app);
require('dotenv').config();
const errorHandler = require("./middleware/error-handler");
const errorMessage = require("./middleware/error-message");
const accessControls = require("./middleware/access-controls");
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser')

const storage=multer.diskStorage({
  destination:function(req,file,cb){
    cb(null,'images/')
  },
  filename:function(req,file,cb){
     cb(null,file.fieldname + '-' +  Date.now() + '-' + file.originalname);
}
});
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true)
  } else {
      //reject file
      cb({message: 'Unsupported file format'}, false)
  }
}

const upload =multer({
  storage:storage,
  fileFilter: fileFilter
});


app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(upload.array('myImage'));
app.use(express.static("public"));
// Requiring Routes

const UsersRoutes = require('./routes/users.routes');
const ProductsRoutes = require('./routes/products.routes');
const SlidersRoutes = require('./routes/sliders.routes');


// connection to mongoose
const mongoCon = process.env.mongoCon;

const connect = async function () {
  return mongoose.connect(mongoCon, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
};

(async () => {
  try {
    const connected = await connect();
  } catch (e) {
    console.log('Error happend while connecting to the DB: ', e.message)
  }
})();

// mongoose.connect(mongoCon, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });


const fs = require('fs');
fs.readdirSync(__dirname + "/models").forEach(function (file) {
  require(__dirname + "/models/" + file);
});

// in case you want to serve images 
app.use(express.static("public"));

app.get('/', function (req, res) {
  res.status(200).send({
    message: 'Express backend server'
  });
});

app.set('port', (process.env.PORT));

app.use(cors());
app.use(accessControls);

// Routes which should handle requests
app.use("/users", UsersRoutes);
app.use("/products", ProductsRoutes);
app.use("/sliders", SlidersRoutes);


app.use(errorHandler);
app.use(errorMessage);
app.get("*", (req, res) => {
  return handle(req, res);
});
app.set("port", process.env.PORT);

server.listen(app.get('port'));
console.log('listening on port', app.get('port'));
