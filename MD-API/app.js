const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

const association = require('./models/association');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser());

const {updateGoalStatus} = require('./middlewares/updateGoalStatus');

app.use(updateGoalStatus);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const activitiesRoutes = require('./routes/activityRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const categoriesRoutes = require('./routes/categoryRoutes');
const typeRoutes = require('./routes/typeRoutes');
const ingredientRoutes = require('./routes/ingredientRoutes');
const goalRoutes = require('./routes/goalsRoutes');
const errorRoutes = require('./routes/errorRoutes');

app.get('/', (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: 'Successful Get Index Page',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

app.use(authRoutes);
app.use('/users', userRoutes);
app.use('/profile', profileRoutes);
app.use('/activities', activitiesRoutes);
app.use('/recipes', recipeRoutes);
app.use('/categories', categoriesRoutes);
app.use('/types', typeRoutes);
app.use('/ingredients', ingredientRoutes);
app.use('/goals', goalRoutes);
app.use(errorRoutes);

association();

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
