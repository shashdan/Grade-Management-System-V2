const express = require('express')
const database = require('../database')

const router = express.Router()

router.get('/profile', async function (req, res) {
    const user = req.session.user
    if (req.session.isAuthenticated) {
        const [userinfo] = await database.query('SELECT * from users WHERE admission_number = ?', [[user.id]])
        return res.render('profile', { user: userinfo[0] })
    }
    else {
        return res.redirect('/')
    }
})

router.get('/schedule', async function (req, res) {
    const user = req.session.user
    if (req.session.isAuthenticated) {
        const [userinfo] = await database.query('SELECT * from users WHERE admission_number = ?', [[user.id]])
        return res.render('schedule', { user: userinfo[0] })
    }
    else {
        return res.redirect('/')
    }
})

router.get('/grades', async function (req, res) {
    const user = req.session.user
    if (req.session.isAuthenticated) {
        const [userinfo] = await database.query('SELECT * from users WHERE admission_number = ?', [[user.id]])
        const [grades] = await database.query('SELECT coursename, coursecoordinator, grade FROM grades NATURAL JOIN courses WHERE studentid = ?' , [[user.id]])
        return res.render('grades', { user: userinfo[0], grades: grades})
    }
    else {
        return res.redirect('/')
    }
})

module.exports = router