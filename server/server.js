const dotenv = require("dotenv");
const app = require("./app");

// Load environment variables
dotenv.config();

// Set port
const PORT = process.env.PORT || 5000;
const dbConfig = require("./config/db");
dbConfig();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
