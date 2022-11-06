# CS3219-AY22-23-Project-Skeleton

This is a template repository for CS3219 project.

## User Service

1. Create a `.env` file.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
5. Enter `ENV=DEV` in `.env` file.
6. Enter `JWT_SECRET=anystringyouwant` in `.env` file.
7. Enter `PORT=http://localhost:3000` in `.env` file.
8. Install npm packages using `npm i`.
9. Run User Service using `npm run dev`.

## Matching Service

1. Create a `.env` file.
2. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
3. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
4. Enter `ENV=DEV` in `.env` file.
5. Enter `PORT=http://localhost:3000` in `.env` file.
6. Install npm packages using `npm i`.
7. Run Matching Service using `npm run dev`.

## Question Service

1. Create a `.env` file.
2. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
3. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
4. Enter `ENV=DEV` in `.env` file.
5. Enter `PORT=http://localhost:3000` in `.env` file.
6. In the database, create a collection name `questions`.
7. Upload the `questions.json` file into the collection named `questions`.
8. Install npm packages using `npm i`.
9. Run Question Service using `npm run dev`.

## Frontend

1. Install npm packages using `npm i`.
2. Run Frontend using `npm start`.

## Run entire Application
1. Install packages in this folder by running `npm i`
2. Install all the packages by running `npm run fullinstall`.
3. Run `npm run fullstart`
