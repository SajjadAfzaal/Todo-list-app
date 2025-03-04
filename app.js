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

app.post("/delete", async (req, res) => {
  try {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if (!checkedItemId || !listName) {
      return res
        .status(400)
        .send("Invalid request: Missing item ID or list name");
    }

    if (listName === "Today") {
      await Item.findByIdAndDelete(checkedItemId);
      console.log("Item deleted successfully");
      res.redirect("/");
    } else {
      const updatedList = await List.findOneAndUpdate(
        { name: listName },
        { $pull: { items: { _id: checkedItemId } } }
      );

      if (!updatedList) {
        return res.status(404).send("List not found");
      }

      res.redirect("/" + listName);
    }
  } catch (err) {
    console.error("Error deleting item:", err);
    res.status(500).send("Internal Server Error");
  }
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
      console.log("Found Successfully");
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
    console.log("New List Created");
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
