const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
var items = ["ride","fly"];
var workitems = [];

app.get("/",function(req,res){
    let day = date();
    res.render("list",{listTitle : day,newListItems : items});
});

app.post("/",function(req,res){
    var item = req.body.newitem;
    if(req.body.list === "work"){
        workitems.push(item);
        res.redirect("/work");
    }
    else{
        items.push(item);
        res.redirect("/");
    }
    console.log(req.body.list);
    console.log(item);
});

app.get("/work",function(req,res){
    res.render("list",{listTitle : "work",newListItems : workitems})
});

app.post("/work",function(req,res){
    var item = req.body.newitem;
    workitems.push(item);
    res.redirect("/work");
})

app.listen(3000,function(){
    console.log("server is running on port 3000");
});