import createServer from "./server.js";

const app = createServer();

const port = process.env.PORT || 5000;

app.listen(port, async () => {
  console.log(`Listening on port ${port}...`);
});
