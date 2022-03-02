const express = require('express')
const bcrypt = require('bcryptjs')
const database = require('../database')

const router = express.Router()

router.get('/', function (req, res) {
    if (req.session.isAdmin){
        res.redirect('/admin')
    }
    res.render('index')
})

router.post('/', function (req, res) {
    const username = req.body.username
    const password = req.body.password

    const existingUsers = database.query('SELECT username FROM login_info')

    if (username === 'admin' && password === 'admin'){
        req.session.user = {id: username}
        req.session.isAuthenticated = true
        req.session.isAdmin = true
        req.session.save(function(){
            return res.redirect('/admin')
        })
    }
    else{
        res.redirect('/')
    }
})

router.get('/:id/profile', function (req, res) {
    // const userid = req.params.id
    // const pathname = path.join(__dirname, 'user.json')
    // const data = fs.readFileSync(pathname)
    // const datainjson = JSON.parse(data)
    // for (user of datainjson) {
    //     if (user.id === userid) {
    //         return res.render('profile', { 'user': user })
    //     }
    // }
    // res.redirect('/')
})

router.get('/:id/grades', function (req, res) {
    // const userid = req.params.id
    // const pathname = path.join(__dirname, 'user.json')
    // const data = fs.readFileSync(pathname)
    // const datainjson = JSON.parse(data)
    // for (user of datainjson) {
    //     if (user.id === userid) {
    //         return res.render('grades', { 'user': user })
    //     }
    // }
    // res.redirect('/')
})

router.get('/:id/schedule', function (req, res) {
    // const userid = req.params.id
    // const pathname = path.join(__dirname, 'user.json')
    // const data = fs.readFileSync(pathname)
    // const datainjson = JSON.parse(data)
    // for (user of datainjson) {
    //     if (user.id === userid) {
    //         return res.render('schedule', { 'user': user })
    //     }
    // }
    // res.redirect('/')
})

router.use(function (req, res) {
    res.redirect('/')
})

module.exports = router