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


## ❤️ Contributing

### 💌 Emails
Aroma handles email templates a little bit differently due to some minor constraints. If you are modifying any of the email templates located in `resources/emails` then please run the following command after:
```sh
npm run generate:mails
```

If you are creating a new email template, then add another npm run command that compiles the emails from Tailwind to plain CSS. An example of which is:
```json
"mailwind:verification": "npx mailwind --input-html ./resources/emails/verification.html --output-html ./resources/emails/build/verification.html",
```

After which, you have to also tell `generate:mails` to run that command as well. In this case, it would be:
```json
"generate:mails": "npm run mailwind:verification && node ./resources/compiler/aromatic.js"
```

Then you can modify `resources/compiler/aromatic.js` to also create a function for that specific template:
```javascript
FUNCTIONS.push(`verification(link: string) { return \`${TEMPLATES['verification']}\`; }`);
```

You can then run the following command to generate the mails: `npm run generate:mails` and you can then use the e-mails inside the code:
```typescript
const template: string = AromaticEmailTemplates.verification("https://localhost:3000/hello-world")
```
