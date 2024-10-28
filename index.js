require('dotenv').config();
const pg = require('pg');
const express = require('express');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://hewhoremains:hewhoremains@localhost:5432/hewhoremains');
const app = express();

// Middleware 
app.use(express.json());
app.use(require('morgan')('dev'));

// CREATE route, Returns the created flavor
app.post('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `INSERT INTO flavors(name, is_favorite) VALUES($1, $2) RETURNING *`;
    const response = await client.query(SQL, [req.body.name, req.body.is_favorite]); // Adjusted to use name and is_favorite
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

// READ route, Returns an array of flavors
app.get('/api/flavors', async (req, res, next) => {
  try {
    const SQL = `SELECT * FROM flavors ORDER BY created_at DESC`;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});

// UPDATE route, Returns the updated flavor
app.put('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `UPDATE flavors SET name=$1, is_favorite=$2, updated_at=now() WHERE id=$3 RETURNING *`;
    const response = await client.query(SQL, [req.body.name, req.body.is_favorite, req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

// DELETE route, Returns nothing
app.delete('/api/flavors/:id', async (req, res, next) => {
  try {
    const SQL = `DELETE FROM flavors WHERE id=$1 RETURNING *`;
    const response = await client.query(SQL, [req.params.id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

// Initialize database and start server
const init = async () => {
  try {
    await client.connect();
    console.log('connected to database img');

    // flavors table 
    let SQL = `
      DROP TABLE IF EXISTS flavors;  -- Ensure this is correct
      CREATE TABLE flavors(
        id SERIAL PRIMARY KEY,
        created_at TIMESTAMP DEFAULT now(),
        updated_at TIMESTAMP DEFAULT now(),
        is_favorite BOOLEAN,
        name VARCHAR(255) NOT NULL
      );
    `;
    await client.query(SQL);
    console.log('tables created');

    // Seed data
    SQL = `
      INSERT INTO flavors(name, is_favorite) VALUES('Orange', TRUE);
      INSERT INTO flavors(name, is_favorite) VALUES('Cherry', FALSE);
      INSERT INTO flavors(name, is_favorite) VALUES('Vanilla', FALSE);
    `;
    await client.query(SQL);
    console.log('data seeded');

    // Start server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`listening on port ${port}`));
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  }
};

// Error for middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

init();
