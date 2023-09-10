const express=require("express")
const client=require("mongodb").MongoClient
const objid=require("mongodb").ObjectId
const app=express()
const session=require("express-session")
const cookie=require("cookie-parser")
// const day=1000*60*60*24
const day=300000
const cors=require("cors");
app.use(cookie());
app.use(
  session({
    secret: 'abhishek',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: day,
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({extended:true}))

let dbinstance;
let collectioninstance;
let collectioninstance_quiz
client.connect("mongodb+srv://abhishek1029sain:abhishek10@cluster0.lawks9g.mongodb.net/").then((database)=>{ 
    dbinstance=database.db("language_quiz")
    collectioninstance= dbinstance.collection("users")
    collectioninstance_quiz=dbinstance.collection("quizQuestions")
    console.log("db connected");
})
app.use(cors({
    origin: ['http://localhost:3000', 'https://www.google.com/']
}))

app.post('/adduser',(req,res)=>{ 
    console.log(req.body);
    let obj={
        "name":req.body.name,
        "username":req.body.username,
        "password":req.body.password,
        "score":0
    }
    collectioninstance.insertOne(obj).then((result)=>{
        // console.log(result);  
    })
})
app.post('/login',(req,res)=>{
    collectioninstance.findOne({$and:[{ "username": req.body.username },{ "password": req.body.password }]}).then((result)=>{
        res.json(result)
    }).catch((err)=>{
        console.log(err)
    })
})

app.get('/getallquestion', (req,res)=>{
    collectioninstance_quiz.find({}).toArray().then((result)=>{
        res.json(result)
    })
})
app.get('/getuserscore/:id',(req,res)=>{
    collectioninstance.findOne({"_id":new objid(req.params.id)}).then((result)=>{ 
        res.json(result)
    })
})
app.post('/updatescore',(req,res)=>{
    const { _id , score} = req.body;
    collectioninstance.updateOne({ _id:new objid(_id)},{$set:{score: score}}).then((result)=>{
        console.log(result)
    })
})
app.get('/getallusers', (req,res)=>{
    collectioninstance.find({}).toArray().then((result)=>{
        // console.log(result)
        res.json(result)
        // res.end()
    })
})

app.post('/addnewquestion',(req,res)=>{
    const {question, options, marks, correctAnswer}=req.body;
    const newQuestion={
        que: question,
        opt1: options[0],
        opt2: options[1],
        opt3: options[2],
        opt4: options[3],
        marks: parseInt(marks),
        ans: correctAnswer,
    }
    console.log(newQuestion)
    collectioninstance_quiz.insertOne(newQuestion).then((result)=>{
        console.log("question added")
    })
    .catch(err=>{
        console.log(err)
    })
})



// app.get('/killsession',(req,res)=>{
//     req.session.destroy()
//     console.log(req.session);
// })

app.listen(3001,()=>{
    console.log("server connected");
})