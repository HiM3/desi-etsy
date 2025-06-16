const dotenv = require("dotenv").config();
const app = require("./app");


const PORT = process.env.PORT || 5000;
const dbConfig = require("./config/db");
dbConfig();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
