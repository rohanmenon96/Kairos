const express = require("express");
const bodyParser = require("body-parser");
const exphbs = require("express-handlebars");
const cookieParser = require("cookie-parser");
const exphndlbars = require("express-handlebars");
const path = require("path");
const axios = require("axios");

const app = express();
var city = "";
var timeArr = [];
var tempArr = [];

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

app.post("/changeCity",async(req,res)=>{
  console.log("Coming Inside /changeCity route with data ", req.body)
  city = req.body.city;
  const data = await axios.post('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&APPID=e82f066c138586d03df0cc3f61415b63');
  console.log(data.data.list.length);

  timeArr = [];
  tempArr = [];
  let temp;

  for(let i=0; i<data.data.list.length; i++)
    {
      timeArr.push(data.data.list[i].dt_txt);
      temp = data.data.list[i].main.temp;
      temp = (temp-273.15)*(9/5)+32; 
      tempArr.push(temp)
    }

  console.log(timeArr.length);
  console.log(tempArr.length);
  
  console.log("\n\nOutput Data: ", data.data.city)
  res.redirect("/");
})

app.get("/",(req,res)=>{
  res.render(path.join(__dirname, "/views/index.handlebars"), {"city" : city, "timeArr": timeArr, "tempArr": tempArr})
})