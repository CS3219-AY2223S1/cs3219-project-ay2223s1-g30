# CS3219-AY22-23-PeerPrep-G30

This is a repository for AY22/23 CS3219 project for G30.

## User Service

1. In the `user-service` subdirectory, create a `.env` file.
2. Create a Cloud DB URL using Mongo Atlas.
3. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
4. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
5. Enter `ENV=DEV` in `.env` file.
6. Enter `JWT_SECRET=anystringyouwant` in `.env` file.
7. Install npm packages using `npm i`.
8. Run User Service using `npm run dev`.

## Matching Service

1. In the `matching-service` subdirectory, create a `.env` file.
2. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
3. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
4. Enter `ENV=DEV` in `.env` file.
5. Install npm packages using `npm i`.
6. Run Matching Service using `npm run dev`.

## Question Service

1. In the `question-service` subdirectory, create a `.env` file.
2. Enter the CLOUD DB URL created as `DB_CLOUD_URI` in `.env` file.
3. Enter the LOCAL DB URL as `DB_LOCAL_URI` in `.env` file.
4. Enter `ENV=DEV` in `.env` file.
5. In the database, create a collection name `questions`.
6. Upload the `questions.json` file into the collection named `questions`.
7. Install npm packages using `npm i`.
8. Run Question Service using `npm run dev`.

## Frontend

1. In the `frontend` subdirectory, install npm packages using `npm i`.
2. Run Frontend using `npm start`.

## Run entire Application
1. Create the Cloud DB URL, all the `.env` files in the relevant subdirectories, and upload the `questions.json` as instructed above.
2. Install packages in the repo root by running `npm i`
3. Install all the packages by running `npm run fullinstall` in the repo root.
4. Run `npm run fullstart` in the repo root.
