const express = require('express')
const next = require('next')
const fs = require('fs')
const bodyParser = require('body-parser');

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    // for parsing application/json
    server.use(bodyParser.json());

    server.post('/pkmn/export', (req, res) => {
      var pokemonData = JSON.parse(fs.readFileSync('./consts/pokelist.json', 'utf8'));

      const ids = req.body
      // console.log("server", req.body);

      const data = pokemonData.filter((item) => {
        return ids.indexOf(item.id) >= 0
      });
      const json = JSON.stringify(data)

      res.setHeader('Content-Type', 'application/json');
      res.send(json);
    })

    server.get('*', (req, res) => {
      return handle(req, res)
    })

    server.listen(port, (err) => {
      if (err) throw err
      console.log(`> Express Ready on http://localhost:${port}`)
    })
  })