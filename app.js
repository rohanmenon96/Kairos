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
var desc = "";
var max,min, dailyMax, dailyMin;
var current;

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
  current = data.data.list[0].main.temp;
  current = (current-273.15)*(9/5)+32; 
  current = Math.trunc(current);
  console.log("\n\n\nCurrent: ", current)

  timeArr = [];
  tempArr = [];
  let temp;
  desc = data.data.list[0].weather[0].main;
  console.log("desc: ", desc)

  for(let i=0; i<data.data.list.length; i++)
    {
      timeArr.push(data.data.list[i].dt_txt);
      temp = data.data.list[i].main.temp;
      temp = (temp-273.15)*(9/5)+32; 
      tempArr.push(temp)
    }

  console.log(timeArr.length);
  console.log(tempArr.length);
  max = -100;
  dailyMax = -100
  min = 999;
  dailyMin = 999;
  for(let i=0; i<10; i++)
    {
      if(tempArr[i]>max)
        {
          max = tempArr[i];
        }
      if(tempArr[i]<min)
        {
          min = tempArr[i]
        }
    }
  for(let i=0; i<tempArr.length; i=i+4)
    {
      if(tempArr[i]>dailyMax)
        {
          dailyMax = tempArr[i];
        }
      if(tempArr[i]<dailyMin)
        {
          dailyMin = tempArr[i]
        }
    }
  max= Math.trunc(max);
  min= Math.trunc(min);
  dailyMax= Math.trunc(dailyMax);
  dailyMin= Math.trunc(dailyMin);

  console.log("Daily max and min: ", dailyMax," ",dailyMin)
  
  console.log("\n\nOutput Data: ", data.data.city)
  res.redirect("/");
})

app.get("/",(req,res)=>{
  res.render(path.join(__dirname, "/views/index.handlebars"), {"city" : city,"current": current, "timeArr": timeArr, "tempArr": tempArr, "desc": desc, "max": max, "min": min, "dailyMax": dailyMax, "dailyMin": dailyMin})
})