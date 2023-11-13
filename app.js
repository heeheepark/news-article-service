const fs = require("fs");
const express = require("express");

const app = express();
app.use(express.json());

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);

const { Pool } = require("pg");

// PostgreSQL 연결 정보 설정
const pool = new Pool({
  user: conf.user,
  host: conf.host,
  database: conf.database,
  password: conf.password,
  port: conf.port,
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM articles");
    res.json(result.rows);
  } catch (err) {
    console.log(err);
  }
});

app.post("/articles", (req, res) => {
  const item = req.body;
  if (
    item.cateId &&
    item.title &&
    item.createdAt &&
    item.creator &&
    item.content
  ) {
    pool.query(
      `INSERT INTO 
        articles (cate_id, title, created_at, creator, content)
      VALUES
        (${item.cateId}, ${item.title}, ${item.createdAt}, ${item.creator}, ${item.content});`,
      (error, result) => {
        if (result) {
          console.log(`Changed Row Count ${result.rowCount}`);
          res.sendStatus(200);
        } else {
          res.sendStatus(500);
        }
      }
    );
  } else {
    res.sendStatus(400);
  }
  // res.send("OK POST~");
});

app.listen(3000, () => {
  console.log(`okay ${3000}`);
});
