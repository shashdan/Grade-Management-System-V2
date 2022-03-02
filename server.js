const express = require('express')
const session = require('express-session')
const database = require('./database')
const app = express()
const MySQLStore = require('express-mysql-session')(session)

var sessionStore = new MySQLStore({}, database);

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const secret = process.env.SECRET_KEY

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: sessionStore
}))

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.use('/admin', require('./routes/admin'))
app.use('/:id', require('./routes/users'))
app.use('/', require('./routes/default'))



app.listen(3000)