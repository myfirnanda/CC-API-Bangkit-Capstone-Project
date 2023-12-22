const express = require('express');
// const session = require('express-session');
const cookieParser = require('cookie-parser');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const association = require('./models/association');

const app = express();

const corsOptions = {
  allowedHeaders: ['Authorization', 'Content-Type'],
};

app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser());
app.use(cors(corsOptions));
// app.use(session({
//   secret: `${process.env.SESSION_SECRET}`,
//   resave: false,
//   saveUninitialized: false,
//   cookie: { },
// }));
app.set('trust proxy', true);

// const User = require('./models/userModel');

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

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'EatWise API',
      description: 'list of API details and database schema of EatWise app.',
      contact: {
        name: 'Firnanda',
        url: 'https://github.com/yg-firnanda',
      },
      version: '1.0.0',
    },
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //   },
    // ],
  },
  apis: ['./app.js', './routes/*.js'],
};

/**
 * @swagger
 * openapi: 3.0.0
 * info:
 *   title: Student API
 *   description: Student API by javaTpoint.com
 *   contact:
 *     name: javatpoint
 *     url: http://javatpoint.com
 *   version: 1.0.0
 * servers:
 *   - url: http://devapi.com
 * tags:
 *   - name: Auth
 *     description: Handle user authentication and authorization.
 *   - name: User
 *     description: Manage user-related information and activities.
 *   - name: Profile
 *     description: Access and update user profiles.
 *   - name: Activity
 *     description: Track and manage various user activities.
 *   - name: Goal
 *     description: Define and manage user goals, which are collections of activities.
 *   - name: Recipe
 *     description: Retrieve and manage data related to recipes.
 *   - name: Category
 *     description: Organize and categorize data into different categories.
 *   - name: Type
 *     description: Manage different types of data.
 *   - name: Ingredient
 *     description: Access and manage information about various ingredients.
 *
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     activities:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     goals:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     recipes:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     ingredients:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     categories:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     types:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     nutrition_facts:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 */

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get('/', updateGoalStatus, (req, res) => {
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

// User loggedIn Middleware
// app.use(async (req, res, next) => {
//   if (req.session.user) {
//     const user = await User.findByPk(req.session.user._id);

//     if (!user) {
//       next();
//     }

//     req.user = user;
//     next();
//   }
// });

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
