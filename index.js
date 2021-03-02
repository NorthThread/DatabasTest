const express = require('express')
const util = require('util')
var bodyParser = require('body-parser');
var mysql = require('mysql')

const app = express()
const port = 3000;




var con = mysql.createConnection({
    host: 'localhost',
    user:'root',
    password: 'Victorm9803',
    database: 'examen'
});

con.connect = util.promisify(con.connect)
con.query = util.promisify(con.query)


app.use(bodyParser.json()); 


const getDurationInMilliseconds = (start) => {
    const NS_PER_SEC = 1e9
    const NS_TO_MS = 1e6
    const diff = process.hrtime(start)

    return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS
}

app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl} [STARTED]`)
    const start = process.hrtime()

    res.on('finish', () => {            
        const durationInMilliseconds = getDurationInMilliseconds (start)
        console.log(`${req.method} ${req.originalUrl} [FINISHED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    res.on('close', () => {
        const durationInMilliseconds = getDurationInMilliseconds (start)
        console.log(`${req.method} ${req.originalUrl} [CLOSED] ${durationInMilliseconds.toLocaleString()} ms`)
    })

    next()
})

app.get('/api/all',async (req, res) =>{
    let data = await con.query('SELECT * FROM users')
    res.status(200)
    res.send(data)
});
app.get('/api/:id',async (req, res) =>{
    let data = await con.query('SELECT * FROM users where id = ' + req.params.id)
    res.status(200)
    res.send(data)
});
app.post('/api/add',async (req, res) =>{
    var person = req.body;
    let data = await con.query(`INSERT INTO users (name, last_name) VALUES ('${person.name}', '${person.last_name}')`)
    res.status(200)
    res.send(data)
});
app.delete('/api/delete/:id',async (req, res) =>{
    let data = await con.query('DELETE FROM users where id = ' + req.params.id)
    res.status(200)
    res.send(data)
});

app.listen(port,async ()=>{
    await con.connect()
    console.log("listening on port 3000")
})