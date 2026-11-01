# Running TCGHub:

Step 0:
Requirements:
node >=26.12.0
docker
docker-compose

Step 1:
clone the repo:
	`git clone git@github.com:Opabinia9/TCGHub.git`

Step 2:
	there are two ways to run the backend and database
	Option 1:
		localy run the docker database
		and then starting the backend with node
	Option 2:
		run the whole thing with docker compose
	Advice:
		chose option 1 if you are devoloping the backed itself, chose option 2 if you just need the backend runing

Option 1:
	cd into the database directory:
	`cd TCGHub/apps/database`
	copy the .env.test to .env and fill out the values:
	`cp .env.example .env`
	`nano .env`
	run docker compose up:
	`docker-compose -f database.yml up`
	or with --env-file to use a diffent file:
	`docker-compose -f docker-compose.database.yml --env-file .env.development up`
	next move to the backend:
	`cd ../backend/`
	and run npm install:
	`npm install`
	again copy the .env.exmaple to .env and fill out the values:
	`cp .env.example .env`
	`nano .env`
	note: make sure the values for the database url match what you put down for the database's env: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}:${POSTGRES_PORT}${POSTGRES_DATABASE}`
	next generate the prisma types and push the schema to the database
	`npx prisma generate`
	`npx prisma db push`
	finally run one of these to start the server:
	`npm run build; npm run start` - one of build and run
	`npm run prod` - coninues rebuiling on changes, no typeschecking
	`watchexec -r -w src npm run build` in one terminal and
	`npx run dev` in another - this will continuely rebuild and reload with typeschecking
Option 2:
	cd into the backend directory:
	`cd TCGHub/apps/backend`
	and run npm install:
	`npm install`
	then copy the .env.exmaple to .env and fill out the values:
	`cp .env.example .env`
	`nano .env`
	note: make sure the values for the database url match what you put down for the database's env: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_URL}:${POSTGRES_PORT}${POSTGRES_DATABASE}`
	cd to the apps directory:
	`cd ../`
	and again copy the .env.exmaple to .env and fill out the values:
	`cp .env.example .env`
	`nano .env`
	then run docker-compose up to run the backend and database:
	`docker-compose up`
	and run with the `--build` flag to rebuild the image if you change the backend .env or code
	`docker-compose up --build`
