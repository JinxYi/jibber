import { config } from 'dotenv';
config({ path:"../../.env" });
import { createConnection } from 'mysql2/promise';

const getConnection = async (dbName = true) => {
  const connectOptions = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_USER_PASSWORD || "root1234",
    // ssl  : {
    //   ca : fs.readFileSync(__dirname + '/mysql-ca.crt')
    // }
  };
  if (dbName) connectOptions.database = process.env.DB_DATABASE_NAME;
  console.log(connectOptions);
  return await createConnection(connectOptions);
};

export { getConnection };