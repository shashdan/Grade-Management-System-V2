const express = require('express')
const fs = require('fs')
const path = require('path')
const uuid = require('uuid')

const app = express()

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
    const pathname = path.join(__dirname, 'user.json')
    const data = fs.readFileSync(pathname)
    const datainjson = JSON.parse(data)
    res.render('index', {'users': datainjson})
})

app.post('/', function (req, res) {
    const submittedData = req.body
    // const pathname = path.join(__dirname, 'user.json')
    // const data = fs.readFileSync(pathname)
    // const datainjson = JSON.parse(data)
    
    res.redirect (`/${submittedData.username}/profile`)
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

app.get('/:id/profile', function (req, res) {
    const userid = req.params.id
    const pathname = path.join(__dirname, 'user.json')
    const data = fs.readFileSync(pathname)
    const datainjson = JSON.parse(data)
    for (user of datainjson){
        if (user.id === userid){
            return res.render('profile', {'user': user})
        }
    }
    res.redirect('/')
})

app.get('/admin', function(req, res){
    const pathname = path.join(__dirname, 'views', 'admin.html')
    res.sendFile(pathname)
})

app.post('/admin', function(req, res){
    const data = req.body
    data.id = uuid.v4();
    const pathname = path.join(__dirname, 'user.json')
    const already = fs.readFileSync(pathname)
    const datainjson = JSON.parse(already)
    datainjson.push(data)
    fs.writeFileSync(pathname, JSON.stringify(datainjson))
    res.redirect('/')
})

app.get('/:id/grades', function (req, res) {
    const userid = req.params.id
    const pathname = path.join(__dirname, 'user.json')
    const data = fs.readFileSync(pathname)
    const datainjson = JSON.parse(data)
    for (user of datainjson){
        if (user.id === userid){
            return res.render('grades', {'user': user})
        }
    }
    res.redirect('/')
})

app.get('/:id/schedule', function (req, res) {
    const userid = req.params.id
    const pathname = path.join(__dirname, 'user.json')
    const data = fs.readFileSync(pathname)
    const datainjson = JSON.parse(data)
    for (user of datainjson){
        if (user.id === userid){
            return res.render('schedule', {'user': user})
        }
    }
    res.redirect('/')
})

app.use(function(req, res){
    res.redirect('/')
})

app.listen(3000)