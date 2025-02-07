Ch 22 Ejs

lec 1 to 4

I learnt Ejs today means Embeded javascript templating in which i installed ejs package through
"npm i ejs"

then set it as viewing engine
"app.set('view engine', 'ejs');"

then created a file named as list.ejs in which i wrote basic html and new thing is that we can pass
js variables there in a tag "<%= tagName %>"

then call it in app.get as with js object(key value pair)
"res.render('list', {kindOfDay: day});"

lec 5 to 7
i learnt the method of formatting date in javascript by toLocaleDateString method and then pass it in 
kindOfDay for date in web browser

then I created a form in browser to get user input as a to do task and then by usind body parsing at 
post route i stored that input in a variable "item" and render it in 'list' by res.render but it gives
errors that at 1st render call it was undefined so i created an array of items to store item(user input)
and pass that in 1st render to list 
"res.render('list', {kindOfDay: day, newListItems: items});"

and use res.redirect in post request to home route
"res.redirect("/");"

then "<%for (const value of newListItems) {%>
            <li><%=value%></li>
        <%}%>"
by this for loop i added all user inputs in to do list.

in lec 7 understood the scope and feasibility to use let instead of var keyword

lec 8
telling express to serve PUBLIC folder for static resources
app.use(express.static("public"));
and then used styles.css from public folder and apply styling on todo list

lec 9
changed typeOfDay to listTitle 

Templating Section
created new array of Work Items to be used on work to do list and a get request to work route
app.get("/work", function(req, res){
    res.render("list", {listTitle:"Work List", newListItems: workItems});
});

then gave submit button of form a value = listTitle and by comparing the listTitles post their request 
to home route and redirect too. This is the templating section.

Layouts section
Removed the header and footers code from list.ejs and created header.ejs and footer.ejs separately and 
include them by ejs like 
<%- include("footer") -%>
and then used them in about.ejs as it used previously.

lec 10 
Module Exports

extract date code from server to another file date.js and used node module.exports
module.exports.getDate = function(){----}
 to exports it into 
app.js file after requiring it
const date = require(__dirname +"/date.js");

and then call it to use where needed like
let day = date.getDate();
