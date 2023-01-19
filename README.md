## Description

This project allows you to search for reviews and comments on games. Using the functionality of the API you can search for reviews, comments, users and other information via different endpoints. /api documentation for useful endpoints

## Getting Started

Create a clone of this application by creating a fork, copy the clone URL given after pressing the green code button and inside your command terminal use the following command:
git clone _url copied_

You are going to need to install some packages. Simply run the following command to install the packages:
npm install .

Next you will need to populate the databases with:
npm run setup-dbs
npm run seed-prod

To run tests on the database and make sure everything is working as it should be, use the following command:
npm t

## Database setup

.env.development will need to be created with the body - PGDATABASE=nc_games
.env.test will need to be created with the body - PGDATABASE=nc_games_test

## Hosting URL

https://nc-games-project.onrender.com

## Dependencies required with versions

"dependencies": {
"dotenv": "^16.0.0",
"express": "^4.18.2",
"supertest": "^6.3.3",
"pg": "^8.8.0",
"pg-format": "^1.0.4"
}

"devDependencies": {
"husky": "^8.0.2",
"jest": "^27.5.1",
"jest-extended": "^2.0.0",
"jest-sorted": "^1.0.14"
}
