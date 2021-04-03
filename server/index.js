const { json } = require('body-parser')
const express = require('express')
const app = express()
const port = 3000 


app.get('/', (req, res) => {
    console.log('request is:'+req.query) 
  res.send('Hello World!')
})

app.post('/', function (req, res) {
    res.send([req.ip,req.body])  
}) 

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) 
}) 