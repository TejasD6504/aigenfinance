let express = require("express");
const app = express();
let mysql = require("mysql")
let body_parser = require("body-parser");
let path = require('path');

// Setup your MySQL connection here
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "finance",
    password: "Tejas@6504"
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

// Routes
// app.get("/",)
app.get('/main',(req, res) => {
    res.render("index.ejs");
});

app.post("/main/new",(req, res) => {
    let {fullName,phone,email,investmentCapacity,sectors,investmentStyle,investmentHorizon} = req.body;

    console.log(req.body);

    try{
        connection.query("insert into investor(Name_of_investor,email_of_investor,phone_of_investor,investmentCapacity,sectors,investmentHorizon) values (?,?,?,?,?,?)",[req.body.fullName,req.body.email,req.body.phone,req.body.investmentCapacity,req.body.sectors,req.body.investmentHorizon],(err1,result1) => {
            if(err1) throw err1;


            connection.query("select * from investor where Name_of_investor = ?",[req.body.fullName],(err2,result2) => {
                if(err2) throw err2;

               res.redirect(`/main/startups/${result2[0].id}`)
      })  
    })
    }catch(err){
            console.log(err);
        }
    })

    app.get("/main/startups/:id",(req,res)=>{
        let {id} = req.params;

        try{
            connection.query("Select * from investor where id = ?",id,(err,result) => {
                if(err) throw err;
                res.render("startup.ejs",{data : result})
            })
         }
          catch(err){
                console.log(err);
            }
    })

    app.post("/main/startupreg/:id",(req,res)=>{
        let {id} = req.params;
        let {startup_name ,year,sec,web,exc,add} = req.body;

        console.log(req.body);

        try{
            connection.query("insert into startup(id,Name_of_startup,YearEst,startup_sector,startup_web,balancesheet,adddoc) values (?,?,?,?,?,?,?)",[id,req.body.startup_name,req.body.year,req.body.sec,req.body.web,req.body.exc,req.body.add],(err,result) => {
                if(err) throw err;
            })
         }
          catch(err){
                console.log(err);
            }
    })


// Start the server
app.listen(1000, () => {
    console.log("Server is running on http://localhost:3000");
});
