// DB 모드 (PostgreSQL)

const fs = require("fs");
const express = require("express");
const app = express();
app.use(express.json());

const database = fs.readFileSync("./database.json");
const conf = JSON.parse(database);

const { Pool } = require("pg");

// PostgreSQL 연결 정보 설정
const db = new Pool({
  user: conf.user,
  host: conf.host,
  database: conf.database,
  password: conf.password,
  port: conf.port,
});

// article GET
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM articles");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

// article POST
app.post("/articles", async (req, res) => {
  const data = req.body;
  if (data.cateId && data.title && data.creator && data.content) {
    try {
      const result = await db.query(
        `INSERT INTO articles (cate_id, title, creator, content) VALUES ($1, $2, $3, $4) RETURNING id;`,
        [data.cateId, data.title, data.creator, data.content]
      );
      const insertedId = result.rows[0].id;
      res.json({
        id: insertedId,
        message: "게시글이 등록되었습니다.",
      });
    } catch (err) {
      console.log(err);
    }
  } else {
    res.sendStatus(400);
  }
});

// articles PATCH
app.patch("/articles/:id", async (req, res) => {
  const articleId = req.params.id;
  const patchData = req.body;
  try {
    const result = await db.query(
      `UPDATE articles SET title = $1, content = $2 WHERE id = $3 RETURNING id`,
      [patchData.title, patchData.content, articleId]
    );
    const updatedId = result.rows[0].id;
    res.json({
      id: updatedId,
      message: "게시글이 수정되었습니다.",
    });
  } catch (err) {
    console.log(err);
  }
});

// articles DELETE
app.delete("/articles/:id", async (req, res) => {
  const articleId = req.params.id;
  try {
    const result = await db.query(`DELETE FROM articles WHERE id = $1`, [
      articleId,
    ]);
    res.json({ message: "게시글이 삭제되었습니다." });
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, () => {
  console.log(`okay ${3000}`);
});
