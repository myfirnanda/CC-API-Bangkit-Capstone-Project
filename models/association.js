const Activity = require('./activityModel');
const Allergy = require('./allergyModel');
const Bookmark = require('./bookmarkModel');
const Category = require('./categoryModel');
const Goal = require('./goalModel');
const IngredientAllergy = require('./ingredientAllergyModel');
const Ingredient = require('./ingredientModel');
const NutritionFact = require('./nutritionFactModel');
const RecipeIngredient = require('./recipeIngredientsModel');
const Recipe = require('./recipeModel');
const Type = require('./typeModel');
const UserAllergy = require('./userAllergyModel');
const User = require('./userModel');

const associateModels = () => {
  // Activity
  Activity.hasOne(Recipe, {foreignKey: 'activity_id'});
  Activity.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Activity.belongsTo(Goal, {
    foreignKey: 'goal_id',
    onDelete: 'CASCADE',
  });

  // Allergy
  Allergy.belongsTo(User, {foreignKey: 'user_id'});
  Allergy.belongsToMany(UserAllergy, {
    foreignKey: 'allergy_id',
    through: 'UserAllergy',
  });
  Allergy.belongsToMany(IngredientAllergy, {
    foreignKey: 'allergy_id',
    through: 'IngredientAllergy',
  });

  // Category
  Category.hasMany(Recipe, {foreignKey: 'category_id'});
  Category.belongsTo(User, {foreignKey: 'user_id'});

  // Goal
  Goal.belongsTo(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  Goal.hasMany(Activity, {
    foreignKey: 'goal_id',
    onDelete: 'CASCADE',
  });

  // Ingredient (NOT WORK IN MYSQL WORKBENCH ERD)
  Ingredient.belongsToMany(RecipeIngredient, {
    foreignKey: 'ingredient_id',
    through: 'RecipeIngredient',
  });
  Ingredient.belongsToMany(IngredientAllergy, {
    foreignKey: 'ingredient_id',
    through: 'IngredientAllergy',
  });

  // Nutrition Fact
  NutritionFact.belongsTo(Recipe, {foreignKey: 'recipe_id'});

  // Recipe
  Recipe.belongsTo(User, {foreignKey: 'user_id'});
  Recipe.belongsTo(Type, {foreignKey: 'type_id'});
  Recipe.belongsTo(Category, {foreignKey: 'category_id'});
  Recipe.belongsTo(Activity, {foreignKey: 'activity_id'});
  Recipe.belongsToMany(RecipeIngredient, {
    foreignKey: 'recipe_id',
    through: 'RecipeIngredient',
  });
  Recipe.belongsToMany(Bookmark, {
    foreignKey: 'recipe_id',
    through: 'Bookmark',
  });
  Recipe.belongsTo(Activity, {foreignKey: 'activity_id'});
  Recipe.hasOne(NutritionFact, {foreignKey: 'recipe_id'});

  // Type
  Type.hasMany(Recipe, {foreignKey: 'type_id'});
  Type.belongsTo(User, {foreignKey: 'user_id'});

  // User
  User.hasMany(Recipe, {foreignKey: 'user_id'});
  User.hasMany(Category, {foreignKey: 'user_id'});
  User.hasMany(Type, {foreignKey: 'user_id'});
  User.belongsToMany(Bookmark, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    through: 'user_id',
  });
  User.hasMany(Activity, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(Goal, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.hasMany(Allergy, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });
  User.belongsToMany(UserAllergy, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    through: 'UserAllergy',
  });
};

module.exports = associateModels;
