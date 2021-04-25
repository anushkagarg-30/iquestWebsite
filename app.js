const express= require('express');
const app = express();
const path = require('path');
const registration = require('./models/registration')
const mongoose=require('mongoose');
const session = require('express-session')
const flash= require('connect-flash')
const mongoSanitize = require('express-mongo-sanitize');
if(process.env.NODE_ENV !== 'production'){
require('dotenv').config()
}
//mongodb://localhost:27017/demo
mongoose.connect(process.env.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'))
app.set('public',path.join(__dirname,'public'))

app.use(express.static("public"))

app.use(express.urlencoded({extended:true}));

const sessionConfig={
    secret:'hola',
    resave:false,
    saveUninitialized:true
}
app.use(session(sessionConfig))

app.use(flash())

app.use((req, res, next)=>{
    res.locals.error=req.flash('error');
    res.locals.success=req.flash('success');
    next();
})

app.use(mongoSanitize({
    replaceWith: '_'
  }))

app.get('/',(req, res) => {
    res.sendFile('index.html')
})

app.get('/registration',(req, res) => {
    res.render('new.ejs')
})

app.post('/registration', async (req, res) => {
    const {email}= req.body;
    await registration.findOne({email}, async function(err,doc) {
        if(err) {
            console.log('error is encountered')
            res.render('error.ejs')
            
        }
        else{
            if(doc!=null){
                req.flash('error','Cannot use same emailId')
                res.redirect('/registration')
            }
            else{
                const c= new registration(req.body)
                await c.save() 
                req.flash('success','You have registered successfully')
                res.redirect('/registration')
        }
    }
    });
   
        
})

app.all('*', (req, res)=>{
    res.render('error.ejs')
})


app.listen(4000,() =>{
    console.log('server is up at 4000');
})