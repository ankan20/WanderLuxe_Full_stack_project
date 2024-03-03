const express = require('express');
const app=express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require("path");
const sessionOptions = {
    secret : "mysupersecretstring",
    resave : false,
    saveUninitialized:true
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(session(sessionOptions));
app.use(flash());



app.get("/register",(req,res)=>{
    let {name="anonymous"} = req.query;
    req.session.name = name;
    req.flash("success","user registered successfully")
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    //console.log(req.flash("success"))
    let msg=req.flash("success")
    
    //console.log(msg)
    res.render("page.ejs",{msg,name:req.session.name})
})















// app.get("/requestcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count ++;
//     }else {
//         req.session.count=1;
//     }
    
//     res.send(`You sent a request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("Test successful!");
// })

app.listen(8080,()=>{
    console.log("server is running")
})