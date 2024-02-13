const dotenv =  require('dotenv') ;
const express = require('express') ; 
const app = express() ;
const port = 3000; 
const mongoose = require('mongoose') ;
const cors = require('cors') ;
const bcrypt = require('bcrypt') ;

dotenv.config() ;
app.use(cors()) ;
app.use(express.json()) ;
// app.use(express.urlencoded({ extended: true })) ;
dotenv.config() ;


mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("Database Connected!")}).catch((err)=>{console.log(err)})

require('./Model') ;
const User = mongoose.model("UserInfo") ;

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


app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));