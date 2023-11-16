const sql = require('mysql')
const fs = require('fs')

const dbconfig = JSON.parse(fs.readFileSync('C:\\temp\\db_config.json'))

const config = {
  host: dbconfig.host,
  user: dbconfig.user,
  password: dbconfig.password,
  database: dbconfig.database
}

module.exports = sql.createPool(config, (err) => {
  if(err) console.err(err)
})