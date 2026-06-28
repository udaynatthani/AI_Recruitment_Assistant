const app = require("./src/app");
require("dotenv").config();
// const  db = require("./src/config/db");
require("./src/config/db");
const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
});