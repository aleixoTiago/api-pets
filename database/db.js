const { Pool } = require('pg');

const pool = new Pool({
  user: 'pet_user',
  host: 'localhost',
  database: 'pet_api',
  password: '123456',
  port: 5432,
});

module.exports = pool;
