const {Pool}=require("pg");

const pool= new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

pool
  .query("SELECT NOW()")
  .then((res) => {
    console.log("✅ PostgreSQL Connected");
    console.log("Current Time:", res.rows[0]);
  })
  .catch((err) => {
    console.log("❌ Database Connection Failed");
    console.error(err.message);
  });


module.exports=pool;