# CC-API-Bangkit-Capstone-Project

## Description
API Testing for Bangkit capstone project later, still in development environment, feel free to contact developer if you found any bugs or errors.

Before you begin, make sure you have installed Node.js on your device. If not, you can download it from here.

Additionally, ensure you have downloaded and installed XAMPP. Once both Node.js and XAMPP are set up, you're ready to start the project.

## Step 1: Activate Apache and MySQL
Open XAMPP and start both Apache and MySQL services.

## Step 2: Install Dependencies
In project terminal, run the following command to download all the required packages:
```bash
npm install
```

## Step 3: Set Up Database
Ensure that you have a database named **my_database** in your MySQL if not create it first, or you can customize the database name by specifying it in the **.env** file.

## Step 4: Run Migrations
Execute the following command to run migrations:
```bash
npx sequelize-cli db:migrate
```

## Step 5: Seed Database (Recommended)
If you need initial data, run the following command:
```bash
npx sequelize-cli db:seed:all
```

## Step 6: Start the Project
To launch the project, use the following command:
```bash
npm start
```

## Step 7: Testing with Postman
You can test the API using Postman. If your project is running on port 3000, enter **localhost:3000/** in Postman. Use either GET or POST HTTP methods.

![Screenshot (524)](https://github.com/yg-firnanda/CC-API-Bangkit-Capstone-Project/assets/82860149/b6a79174-b1c1-4ee8-8bdc-8872327f2ac2)

For a complete list of valid URLs and HTTP methods, refer to the 'routes' folder.

If you encounter any issues during the testing process, please contact the respective developer.
