const express = require('express');
const bodyParser = require('body-parser')

const port = 12800;
const app = express();
app.use(bodyParser.json());


function processRequest(req, res) {
    console.log(`REQUEST: ${req.path}`);
    console.log(`DATA: ${JSON.stringify(req.body)}`);
    res.status(200).send({status: 'success'});
}


app.post('/api/is_exists', (req, res) => processRequest(req, res));
app.post('/api/install', (req, res) => processRequest(req, res));

app.listen(port, () => {
    console.log('PS4 test server started');
})