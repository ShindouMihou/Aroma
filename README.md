# 🌸 Aroma
Aroma is a possible incoming open-source web-novel platform that is written under Sveltekit with Tailwind. It is a project that is created mainly out of fun and more exploration of Sveltekit and how to implement this and that (MeiliSearch, etc.) without the help of a full-stack framework (e.g. Laravel).

## 🎡 Progress
This is the current progress of Aroma and a little roadmap for the future.
- [x] Authentication backend
- [x] Email Verification
- [ ] Book creation, deletion and editing.
- [ ] Liking, views, bookmarking, reading list.
- [ ] Chapter creation, deletion, editing.
- [ ] Repositioning chapters.
- [ ] Frontend design

## 🛞 Stack
- [x] MongoDB: For storing long-term data.
- [x] Svelte: The entire web framework itself.
- [x] Typescript: The language being used to write the application.
- [ ] Docker: Used for containerzation and scaling of the application (with Docker Swarm).
- [ ] Meilisearch: Used for finding results of a search, may be skipped in favor of full-text index of MongoDb.
- [ ] Redis: Used for caching data that are accessed frequently.

## 🕸️ Testing
You can test out the current state of the project by cloning the repo and then following the steps below.
1. Configure the development MongoDB instance (not recommended for production): `cp .mongo.example .mongo && nano .mongo`
2. Spin up a MongoDB instance (this should start at port 8210): `docker-compose up -d`
3. Configure the `.env` file: `cp .env.example .env && nano .env`
4. Run Sveltekit's development mode: `npm run dev` and it should run at `localhost:3000`.