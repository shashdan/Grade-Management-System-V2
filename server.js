const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    const pathname = path.join(__dirname, 'views', 'index.html')
    res.sendFile(pathname)
})

app.get('/contact', function(req, res){
    const pathname = path.join(__dirname, 'views', 'contact.html')
    res.sendFile(pathname)
})

app.post('/contact', function(req, res){
    const data = req.body
    const pathname = path.join(__dirname, 'feedback.json')
    const already = fs.readFileSync(pathname)
    const datainjson = JSON.parse(already)
    datainjson.push(data)
    fs.writeFileSync(pathname, JSON.stringify(datainjson))
    res.redirect('/')
})

app.get('/profile', function (req, res) {
    res.render('profile')
})

app.get('/grades', function (req, res) {
    res.render('grades')
})

app.get('/schedule', function (req, res) {
    res.render('schedule')
})

app.listen(3000)