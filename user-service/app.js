const express = require('express');
const mongoose = require('mongoose');
const Users = require('./routes/users');

require('dotenv').config()

const app = express();
app.use(express.json());

mongoose.connect(process.env.DATABASE_URI);

const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log("Connected to database"));

app.use('/users', Users);

app.listen(process.env.USER_SERVICE_PORT, () => console.log(`Server running on http://localhost:${process.env.USER_SERVICE_PORT}`));
