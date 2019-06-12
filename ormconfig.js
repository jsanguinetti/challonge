const env = require("dotenv");
env.config();

const isProd = process.env.NODE_ENV === "production";
const entitiesExtension = "ts";
const entitiesDir = "src";
const migrationsDir = "src/migration/*.ts";

module.exports = {
  type: "postgres",
  entities: [`${__dirname}/${entitiesDir}/**/*.entity.${entitiesExtension}`],
  url: process.env.DATABASE_URL,
  migrations: [migrationsDir],
  cli: {
    migrationsDir: "src/migration"
  }
};
