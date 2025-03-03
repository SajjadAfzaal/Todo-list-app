const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

// setting the ejs as a viewing engine
app.set("view engine", "ejs");
// setting bory parser for post method
app.use(bodyParser.urlencoded({ extended: true }));
// telling express to serve PUBLIC folder for static resources
app.use(express.static("public"));

const itemSchema = {
  name: String,
};

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
  name: "Welcome to your ToDo-List",
});
const item2 = new Item({
  name: "Click + to add more items",
});
const item3 = new Item({
  name: "<-- click to delete an item",
});

const defaultItems = [item1, item2, item3];

app.get("/", async function (req, res) {
  //1. let day = getDate();
  let day = date.getDay();
  let arr = await Item.find();
  if (arr.length == 0) {
    Item.insertMany(defaultItems)
      .then(() => {
        console.log("default items added Successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    res.render("list", { listTitle: day, newListItems: arr });
  }
});

app.post("/", function (req, res) {
  let item = req.body.newItem;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    // res.render('list', {newListItem: item});
    res.redirect("/");
  }
});

app.get("/work", function (req, res) {
  res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

// const express = require("express");
// const bodyParser = require("body-parser");

// const app = express();

// // setting the ejs as a viewing engine
// app.set('view engine', 'ejs');

// app.get("/", function(req,res){
//     let today = new Date();
//     let currentDay = today.getDay();

//     // const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
//     // let day = weekday[currentDay];

//     if(currentDay === 6 || currentDay === 0){
//         // res.write("<h1> Ahha! Its weekend</h1>");

//         // res.sendFile(__dirname + "/weekend.html");
//         res.render('list', {kindOfDay: day});
//     }
//     else{
//         // res.write("<h1> Boo! Its week day</h1>");
//         // res.write("<p> I have to work!</p>");

//         // res.sendFile(__dirname + "/index.html");
//         // res.sendFile(__dirname + "/weekday.html");
//         res.render('list', {kindOfDay: day});
//     }
//     // res.send();
// });

// app.listen(3000, function(){
//     console.log("Server is running on port 3000");
// });
