const { createServer } = require('https');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync('/home/smart/ssl/2020.smlog_wild.key'),
  cert: fs.readFileSync('/home/smart/ssl/2020.smlog_wild.crt')
};

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
    
  }).listen(80, err => {
    if (err) throw err;
    console.log('> Ready on https://localhost:80');
  });
});

// const express = require('express')
// const next = require('next')
// const cors = require('cors')

// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app
//   .prepare()
//   .then(() => {
//     const server = express()
//     server.use(cors());
//     server.use(express.static('public'));

//     server.get('/p/:id', (req, res) => {
//       const actualPage = '/post'
//       const queryParams = { title: req.params.id }
//       app.render(req, res, actualPage, queryParams)
//     })

//     server.get('*', (req, res) => {
//       console.log('req------------------------------------------------------------');
//       return handle(req, res)
//     })

//     server.listen(3000, err => {
//       if (err) throw err
//       console.log('> Ready on http://localhost:3000')
//     })
//   })
//   .catch(ex => {
//     console.error(ex.stack)
//     process.exit(1)
//   })
