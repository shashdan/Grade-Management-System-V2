const mysql = require('mysql2/promise')

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const DBpassword = process.env.DATABASE_PASSWORD

const database = mysql.createPool({
    host: 'localhost',
    database: 'grade_management_system',
    user: 'root',
    password: DBpassword
})

module.exports =  database