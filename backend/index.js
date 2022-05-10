const express = require('express');
const cors = require('cors');
const parse = require('pg-connection-string').parse;
const http = require('http');
const bodyParser = require('body-parser');

const { Pool } = require('pg');

const config = parse('postgres://me:password@localhost:5432/movement')

const pool = new Pool(config);

const app = express();

app.use(
  cors({
    origin: '*',
  })
);
// app.use(bodyParser.json());
// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

const defaultRouter = require('./routes/routes');

app.get('/test', (req, res) => res.send('This is working'));
app.use('/api', defaultRouter);

const port = 8000;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on:', port);

const addUser = (req, res, next) => {
  const query = {
    text: `
    INSERT INTO movers (email, name, password)
      VALUES ($1, $2, $3)
    `,
    values: ['dio@hello.com, dio, password1']
  };
  
  pool.query(query, (err, results) => {
    if (err) {
      throw err;
    }
    res.send(results.rows);
  });
};