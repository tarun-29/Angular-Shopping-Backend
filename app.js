const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')



app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}))
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname,'public')))


//import routers 
const productRoute = require('./routes/product')
const ordersRoute = require('./routes/orders')

app.use('/api/products',productRoute)
app.use('/api/orders',ordersRoute)



// app.use('/users',userRouter)

app.listen(8080, (req, res)=>{
    console.log("server is listening");
})