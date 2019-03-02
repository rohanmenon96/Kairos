const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const exphndlbars = require("express-handlebars");
const path = require("path");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(cookieParser());

const static = express.static(__dirname + "/views");
app.use("/views", static);

app.set("view engine", "handlebars");
app.engine("handlebars", exphndlbars({defaultLayout:""}));

app.listen(80, () => {
  console.log("We've now got a server!");
});

app.get("/",(req,res)=>{
  res.sendFile(path.join(__dirname, "/views/index.html"))
})

