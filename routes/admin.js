const express = require('express')
const bcrypt = require('bcryptjs')
const database = require('../database')

const router = express.Router()

router.get('/', function (req, res) {
    if (!req.session.isAdmin){
        return res.redirect('/')
    }
    else{
        return res.render('admin')
    }  
})

router.get('/create', function (req, res) {
    if (!req.session.isAdmin){
        return res.redirect('/')
    }
    else{
        return res.render('createuser')
    }  
})

router.get('/modify', function (req, res) {
    if (!req.session.isAdmin){
        return res.redirect('/')
    }
    else{
        return res.render('modifyuser')
    }  
})

router.get('/grades', function (req, res) {
    if (!req.session.isAdmin){
        return res.redirect('/')
    }
    else{
        return res.render('updategrades')
    }  
})

router.post('/create', function (req, res) {
    const username = req.body.admissionnumber
    const password = req.body.password
    const hashedpassword = bcrypt.hashSync(password, 12)

    database.query('INSERT INTO login_info VALUES (?)', [[username, hashedpassword]])
    database.query('INSERT INTO users VALUES (?)', [[username, req.body.name, req.body.fathersname, req.body.branch, req.body.emailid, req.body.number, req.body.semester, req.body.image]])

    res.redirect('/admin')
})

router.post('/logout', function(req, res){
    req.session.user = null
    req.session.isAuthenticated = false
    req.session.isAdmin = false
    res.redirect('/')
})

module.exports = router
