import { Application } from "https://deno.land/x/abc/mod.ts";
import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { abcCors } from "https://deno.land/x/cors/mod.ts";

const db = new DB("stories.db");
const app = new Application();
const PORT = 8080;

app
  .use(
    abcCors({
      allowedHeaders: [
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "User-Agent",
      ],
      credentials: true,
    })
  )
  .get("/stories", async (server) => {
    await getStories(server);
  })
  .post("/stories/:id/votes", async (server) => {
    await voting(server);
  })
  .get("/submit", async (server) => {})
  .post("/stories", async (server) => {
    await postStory(server);
  })
  .get("/login", async (server) => {})
  .post("/sessions", async (server) => {})
  .delete("/stories/:id", (server) => {
    deleteStory(server);
  })
  .delete("/sessions", async (server) => {})
  .get("/signup", async (server) => {})
  .post("/users", async (server) => {
    await createUser(server);
  })
  .start({ port: PORT });

console.log(`Server running on http://localhost:${PORT}`);

async function getStories(server) {
  const stories = db.queryEntries(`SELECT stories.*,
  MAX(0, SUM(CASE direction WHEN 'up' THEN 1 ELSE -1 END)) AS score
  FROM stories
  LEFT JOIN votes ON votes.story_id = stories.id
  GROUP BY stories.id;`);
  if (stories) {
    await server.json(stories);
  } else {
    server.json("no stories yet");
  }
}

async function postStory(server) {
  const { title, url } = await server.body;
  if ((title, url && title !== "" && url !== "")) {
    db.query(
      "INSERT INTO stories (title, url, created_at, updated_at) VALUES(?, ?, datetime('now') ,datetime('now'));",
      [title, url]
    );
    return server.json({ response: "New news story added" }, 200);
  } else {
    return server.json({ response: "Missing info" }, 400);
  }
}

async function voting(server) {
  const { id } = server.params;
  const { direction } = await server.body;
  db.query(
    `INSERT INTO votes(direction, story_id, created_at, updated_at) VALUES (?, ?, datetime('now'), datetime('now'));`,
    [direction, id]
  );
  return server.json({ response: "Vote Added" }, 200);
}

function deleteStory(server) {
  const { id } = server.params;
  db.query("DELETE FROM votes WHERE story_id = ?", [id]);
  db.query("DELETE FROM stories WHERE id = ?", [id]);
  return server.json({ response: "story successfully deleted" }, 200);
}
