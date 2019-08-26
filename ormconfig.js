const env = require("dotenv");

const usingTsNode = !!process.env.TSNODE
const entitiesExtension = usingTsNode ? "ts" : 'js';
const entitiesDir = usingTsNode ? "src" : 'dist';
const migrationsDir = usingTsNode ? "src/migration/*.ts" : "dist/migration/*.js";
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
