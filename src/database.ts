import { createPool } from 'mysql2/promise'

const mysqlUri = process.env.MYSQL_URI || 'mysql://root@localhost/test'

export const dbPool = createPool({
  uri: mysqlUri,
  waitForConnections: true,
  connectionLimit: 4,
  queueLimit: 0,
})
