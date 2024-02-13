const dotenv =  require('dotenv') ;
const express = require('express') ; 
const app = express() ;
const port = 3000; 
const mongoose = require('mongoose') ;
const cors = require('cors') ;
const bcrypt = require('bcryptjs') ;
const jwt = require('jsonwebtoken') ;

dotenv.config() ;
app.use(cors()) ;
app.use(express.json()) ;
// app.use(express.urlencoded({ extended: true })) ;
dotenv.config() ;

const JWT_SECRET = "helloworld" ;

mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("Database Connected!")}).catch((err)=>{console.log(err)})

require('./Model') ;
const User = mongoose.model("UserInfo") ;

// register route 
app.post("/register",async(req,res)=>{
    
    const  {name,email,mobile,password} = req.body ;
    const oldUser = await User.findOne({ email : email }) ;
     
    const encryptedPassword = await bcrypt.hash(password,10) ;


    if(oldUser)
    {
        return res.send({data : "User already exists!!!"}) ;
    }

    try {
        await User.create({
            name: name,
            email: email,
            mobile,
            password:encryptedPassword
        })
        res.send({status: "ok" ,data: "User created"}) ;
        
    } catch (error) {
        res.send({status: "error" ,data: error}) ;
    }
});

// login route 
app.post("/login-user",async(req,res)=>{
    const {email,password } = req.body ;
    const oldUser = await User.findOne({email:email}) ;   
    if(!oldUser)
    {
        return res.send({data:"User not Exists"}) ;
    }
    if(await bcrypt.compare(password,oldUser.password))
    {
       const token = jwt.sign({email:oldUser.email},JWT_SECRET) ;
       console.log(token)
       if(res.status(201))
       {
        return res.send({status: "ok" , data: token});
       }
       else{
        return res.send({error: "error"}) ;  
       }
    }
    else
    {
        res.send({status:"error",data:"Invalid Password"}) ;
    }
})


//user data 
app.post("/userdata",async(req,res)=>{
    const {token} = req.body ;
    try {
       const user =  jwt.verify(token,JWT_SECRET)  ;
       const useremail = user.email ;

    User.findOne({email:useremail}).then((data)=>{
        return res.send({status:"ok",data:data})
    })
    } catch (error) {
        return res.send({error: "error"}) ;  
    }
})


app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));