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

router.post('/', async function (req, res) {
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password

    const [existingUsers] = await database.query('SELECT username FROM login_info WHERE username = ?', [[enteredUsername]])

    if (enteredUsername === 'admin' && enteredPassword === 'admin'){
        req.session.user = {id: enteredUsername}
        req.session.isAuthenticated = true
        req.session.isAdmin = true
        req.session.save(function(){
            return res.redirect('/admin')
        })
    }
    else if (existingUsers.length > 0){
        const [passwordInDB] = await database.query('SELECT password FROM login_info WHERE username = ?', [[enteredUsername]])
        const pass = passwordInDB[0].password
        const equal = await bcrypt.compare(enteredPassword, pass)
        if (equal){
            req.session.user = {id: enteredUsername}
            req.session.isAuthenticated = true
            req.session.save(function(){
            return res.redirect(`/${enteredUsername}/profile`)
        })
        }
        else{
            return res.redirect('/')
        }
    }
    else{
        return res.redirect('/')
    }
})

app.post('/logout', function (req, res) {
    req.session.user = null
    req.session.isAuthenticated = false
    req.session.isAdmin = false
    res.redirect('/')
})

router.use(function (req, res) {
    res.redirect('/')
})

module.exports = router