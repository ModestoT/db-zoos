const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3',
  },
  useNullAsDefault: true, // needed for sqlite
};
const db = knex(knexConfig);

const server = express();

server.use(helmet());
server.use(express.json());
// endpoints here

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos'); 
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos').where({ id: req.params.id }).first();
    if(zoo){
      res.status(200).json(zoo);
    } else {
      res.status(400).json({ error: 'No zoo with that id was found' });
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

server.post('/api/zoos', async (req, res) => {
  if(!req.body.name){
    res.status(400).json({ error: 'Please assign a name to the Zoo' });
  } else {
    try {
      const [id] = await db('zoos').insert(req.body);
      const zoo = await db('zoos').where({ id }).first();

      res.status(201).json(zoo);
    } catch (error){
      res.status(500).json(error);
    }
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
