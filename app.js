const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const ItemSchema = {
    name : String
};
const Item = mongoose.model("Item",ItemSchema);

const item1 = new Item({
    name : "Welcome to your new todolist"
});

const item2 = new Item({
    name : "Click + button to add items"
});

const item3 = new Item({
    name : "<-- Click this to remove a item"
});

const defaultItem = [item1,item2,item3];

const listSchema = {
    name : String,
    items : [ItemSchema]
}

const List = mongoose.model("List",listSchema);

app.get("/",function(req,res){

    Item.find({},function(err,founditem){
        if(founditem.length === 0){
            Item.insertMany(defaultItem,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Added item to DB");
            }
            res.redirect("/");
        })
        }
        else{
            res.render("list",{listTitle : "Today",newListItems : founditem});
        }
    });

});

app.post("/",function(req,res){
    const itemname = req.body.newitem;
    const listname = req.body.list;
    const item = new Item({
        name : itemname
    });

    if(req.body.listname === "Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name : listname},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listname);
        });
    }

    
});



app.get("/:customlistname",function(req,res){
    const customListName = _.capitalize(req.params.customlistname);
    List.findOne({name : customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                //console.log("Doesn't exists");
                //create new list
                const list = new List({
                    name : customListName,
                    items : defaultItem
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else{
                //console.log("exists");
                //show existing list
                res.render("list",{listTitle : foundList.name,newListItems:foundList.items});
            }
        }
    });
    
   
});

app.post("/work",function(req,res){
    var item = req.body.newitem;
    workitems.push(item);
    res.redirect("/work");
})

app.post("/delete",function(req,res){
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if(listName === "Today"){

        Item.findByIdAndRemove(checkedItemId ,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("Successfully deleted item");
            }
            res.redirect("/");
        })
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull: {items :{_id : checkedItemId}}},function(err,foundlist){
            if(!err){
                console.log("Deleted item from list");
                res.redirect("/"+listName);
            }
        });
    }
})

app.listen(3000,function(){
    console.log("server is running on port 3000");
});