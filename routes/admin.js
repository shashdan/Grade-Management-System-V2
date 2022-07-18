const express = require('express')
const bcrypt = require('bcryptjs')
const database = require('../database')

const router = express.Router()

router.get('/', function (req, res) {
    if (!req.session.isAdmin) {
        res.redirect('/')
    }
    else {
        return res.render('admin')
    }
})

router.get('/create', function (req, res) {
    if (!req.session.isAdmin) {
        return res.redirect('/')
    }
    else {
        return res.render('createuser')
    }
})

router.get('/courses', function (req, res) {
    if (!req.session.isAdmin) {
        return res.redirect('/')
    }
    else {
        return res.render('courses')
    }
})

router.get('/modify', async function (req, res) {
    if (!req.session.isAdmin) {
        return res.redirect('/')
    }
    else {
        const [users] = await database.query('SELECT * FROM users')
        if (req.session.selectedUser) {
            const admissionnumber = req.session.selectedUser
            const [user] = await database.query('SELECT * FROM users WHERE admission_number = ?', [[admissionnumber]])
            return res.render('modifyuser', { users: users, user: user, admissionnumber: admissionnumber })
        }
        else {
            return res.render('modifyuser', { users: users, admissionnumber: null })
        }
        //console.log(users)
    }
})

router.post('/modify', async function (req, res) {
    const user = req.body
    const query = `UPDATE users 
                   SET 
                   name = ?, 
                   father_name = ?, 
                   branch = ?, 
                   emailid = ?, 
                   mobile_number = ?, 
                   semester = ?, 
                   image = ?
                   WHERE admission_number = ?`
    const [a] = await database.query(query, [[req.body.name], [req.body.fathersname], [req.body.branch], [req.body.emailid], [req.body.number], [req.body.semester], [req.body.image], [req.session.selectedUser]])
    req.session.selectedUser = null
    return res.redirect('/admin/modify')
})

router.post('/modifyselect', function (req, res) {
    const admission_number = req.body.admission_number;
    req.session.selectedUser = admission_number;
    req.session.save(function () {
        return res.redirect('/admin/modify')
    })
})

router.post('/delete', async function (req, res) {
    const a = await database.query('DELETE FROM users WHERE admission_number = ?', [[req.session.selectedUser]])
    const b = await database.query('DELETE FROM login_info WHERE username = ?', [[req.session.selectedUser]])
    req.session.selectedUser = null
    req.session.save(function () {
        return res.redirect('/admin/modify')
    })
})

router.get('/grades', async function (req, res) {
    if (!req.session.isAdmin) {
        return res.redirect('/')
    }
    else {
        const [users] = await database.query('SELECT * FROM users')
        if (req.session.selectedUser) {
            const admissionnumber = req.session.selectedUser
            const [grades] = await database.query('SELECT courseid, coursename, grade FROM grades NATURAL JOIN courses WHERE studentid = ?' , [[admissionnumber]])
            return res.render('updategrades', {users:users, grades:grades, admissionnumber: admissionnumber })
        }
        else {
            return res.render('updategrades', {users:users, grades:null, admissionnumber: null })
        }
    }
})

router.post('/updategrades', function (req, res) {
    const admission_number = req.body.admission_number;
    req.session.selectedUser = admission_number;
    req.session.save(function () {
        return res.redirect('/admin/grades')
    })
})

router.post('/create', function (req, res) {
    const username = req.body.admissionnumber
    const password = req.body.password
    const hashedpassword = bcrypt.hashSync(password, 12)

    database.query('INSERT INTO login_info VALUES (?)', [[username, hashedpassword]])
    database.query('INSERT INTO users VALUES (?)', [[username, req.body.name, req.body.fathersname, req.body.branch, req.body.emailid, req.body.number, req.body.semester, req.body.image]])

    return res.redirect('/admin')
})

router.post('/logout', function (req, res) {
    req.session.user = null
    req.session.isAuthenticated = false
    req.session.isAdmin = false
    req.session.selectedUser = null
    return res.redirect('/')
})

router.post('/createcourse', function (req, res) {
    const courseid = req.body.courseid
    const coursename = req.body.coursename
    const coursecoordinator = req.body.coursecoordinator
    database.query('INSERT INTO courses VALUES (?)', [[courseid, coursename, coursecoordinator]])
    return res.redirect('/admin')
})

router.post('/changegrades', function (req, res) {
    const user = req.body.userid.trim()
    for (let property in req.body){
        if (property.length === 3){
            const id = parseInt(property.trim(), 10)
            const value = parseInt(req.body[property].trim(), 10)
            console.log(id, value)
            database.query('UPDATE grades SET grade = ? WHERE courseid = ? AND studentid = ?', [[value], [id], [user]])
        }    
    }
    req.session.selectedUser = null
    return res.redirect('/admin/grades')
})

module.exports = router
