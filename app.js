const express = require("express");
const bodyParser = require("body-parser");

const date = require(__dirname +"/date.js");

const app = express();

// setting the ejs as a viewing engine
app.set('view engine', 'ejs');
// setting bory parser for post method
app.use(bodyParser.urlencoded({extended:true}));
// telling express to serve PUBLIC folder for static resources
app.use(express.static("public"));

const items = ["Buy Food","Cook Food","Eat Food"];
const workItems = [];

app.get("/", function(req,res){
    //1. let day = getDate();
    let day = date.getDay();
    res.render('list', {listTitle: day, newListItems: items});

});

app.post("/", function(req, res){
    let item = req.body.newItem;
    if(req.body.list === "Work"){
        workItems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
    // res.render('list', {newListItem: item});
        res.redirect("/");
    }
    
});

app.get("/work", function(req, res){
    res.render("list", {listTitle:"Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
    res.render("about");
});

app.listen(3000, function(){
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

