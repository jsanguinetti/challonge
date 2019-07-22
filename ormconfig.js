const env = require("dotenv");

const entitiesExtension = "ts";
const entitiesDir = "src";
const migrationsDir = "src/migration/*.ts";
let ssl = process.env.DATABASE_SSL && JSON.parse(process.env.DATABASE_SSL)
if (ssl == null) ssl = (process.env.NODE_ENV == 'production')

module.exports = {
  type: "postgres",
  entities: [`${__dirname}/${entitiesDir}/**/*.entity.${entitiesExtension}`],
  url: process.env.DATABASE_URL,
  ssl,
  migrations: [migrationsDir],
  cli: {
    migrationsDir: "src/migration"
  }
};
