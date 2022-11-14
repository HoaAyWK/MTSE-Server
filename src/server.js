require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');

const PORT = process.env.PORT || 5000;

connectDatabase();

app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
);

module.exports = app