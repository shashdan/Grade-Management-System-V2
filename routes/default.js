const express = require('express')
const bcrypt = require('bcryptjs')
const database = require('../database')

const router = express.Router()

router.get('/', function (req, res) {
    const error = req.session.hasError
        res.render('index', { error: error})
})

router.post('/', async function (req, res) {
    const enteredUsername = req.body.username
    const enteredPassword = req.body.password

    const [existingUsers] = await database.query('SELECT username FROM login_info WHERE username = ?', [[enteredUsername]])

    if (enteredUsername === 'admin' && enteredPassword === 'admin') {
        req.session.user = { id: enteredUsername }
        req.session.isAuthenticated = true
        req.session.isAdmin = true
        req.session.save(function () {
            req.session.hasError = false
            return res.redirect('/admin')
        })
    }
    else if (existingUsers.length > 0) {
        const [passwordInDB] = await database.query('SELECT password FROM login_info WHERE username = ?', [[enteredUsername]])
        const pass = passwordInDB[0].password
        const equal = await bcrypt.compare(enteredPassword, pass)
        if (equal) {
            req.session.user = { id: enteredUsername }
            req.session.isAuthenticated = true
            req.session.hasError = false
            req.session.save(function () {
                return res.redirect(`/${enteredUsername}/profile`)
            })
        }
        else {
            req.session.hasError = true
            return res.redirect('/')
        }
    }
    else {
        req.session.hasError = true
        return res.redirect('/')
    }
})

router.post('/logout', function (req, res) {
    req.session.user = null
    req.session.isAuthenticated = false
    req.session.isAdmin = false
    res.redirect('/')
})

// router.use(function (req, res, error) {
//     if (error){
//         res.redirect('/')
//     }
// })

module.exports = router