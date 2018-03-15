// Update with your config settings.

module.exports = {

  local: {
    client: 'mysql2',
    connection: {
      database: 'your_database_name',
      user:     'root',
      password: 'root',
      acquireConnectionTimeout: 10000
    }
  }
};

