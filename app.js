const express = require('express');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));

const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipe');
const errorRoutes = require('./routes/error');

app.use(authRoutes);
app.use(recipeRoutes);
app.use(errorRoutes);

app.listen(3000);
