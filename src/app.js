const express = require('express');
const cors = require('cors');
const route = require('./routes/index');

const errorHandlersMiddleware = require('./middlewares/errorHandlers');

const app = express();


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: 'http://localhost:3000', allowedHeaders: 'Content-Type,Authorization', credentials: true }));

route(app);

app.use(errorHandlersMiddleware);

module.exports = app;