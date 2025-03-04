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
  //let day = date.getDay();
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
    res.render("list", { listTitle: "Today", newListItems: arr });
  }
});

app.post("/", function (req, res) {
  let task = req.body.newItem;
  const listName = req.body.list;

  const newtask = new Item({
    name: task,
  });

  if (listName === "Today") {
    newtask.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then((foundList) => {
      foundList.items.push(newtask);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  Item.findByIdAndDelete(req.body.checkbox)
    .then(() => {
      console.log("Item deleted Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
  res.redirect("/");
});

const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/:customListName", async function (req, res) {
  const customName = req.params.customListName;

  try {
    let foundList = await List.findOne({ name: customName });

    if (foundList) {
      console.log("Found Successfully:", foundList);
      res.render("list", {
        listTitle: foundList.name,
        newListItems: foundList.items,
      }); // Send found list to client
      return;
    }

    // If no list exists, create and save a new one
    let newList = new List({
      name: customName,
      items: defaultItems,
    });

    let savedList = await newList.save();
    console.log("New List Created:", savedList);
    res.render("list", {
      listTitle: savedList.name,
      newListItems: savedList.items,
    }); // Send new list to client
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server Error"); // Send error response
  }
});

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
