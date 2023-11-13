// DB없는 모드

const express = require("express");
const app = express();

app.set("port", process.env.PORT || 3000);

let idNum = 1;

const db = {
  articles: [
    // {
    //   id: 1,
    //   cateId: 4,
    //   title: "제머나이소프트 1",
    //   creator: "박주희",
    //   content: "신입직원교육 1",
    // },
    // {
    //   id: 2,
    //   cateId: 4,
    //   title: "제머나이소프트 2",
    //   creator: "박주희",
    //   content: "신입직원교육 2",
    // },
    // {
    //   id: 3,
    //   cateId: 4,
    //   title: "제머나이소프트 3",
    //   creator: "박주희",
    //   content: "신입직원교육 3",
    // },
    // {
    //   id: 4,
    //   cateId: 4,
    //   title: "제머나이소프트 4",
    //   creator: "박주희",
    //   content: "신입직원교육 4",
    // },
  ],
};

app.use(express.json());

app.get("/", (res) => {
  res.json("Hello, World");
});

// 전체 기사 조회
app.get("/articles", (res) => {
  res.json(db);
});

// 기사 세부 조회
app.get("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  const findData = db.articles.find((item) => item.id === articleId);
  res.json(findData);
});

// 뉴스 기사 추가
app.post("/articles", (req, res) => {
  const postData = req.body;
  const newArticle = {
    id: idNum,
    cateId: postData.cateId,
    title: postData.title,
    createdAt: postData.createdAt,
    creator: postData.creator,
    content: postData.content,
  };
  db.articles.push(newArticle);
  idNum += 1;
  res.json(db);
});

// 뉴스 기사 수정
app.patch("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  const patchData = req.body;
  const newArticle = {
    id: articleId,
    cateId: patchData.cateId,
    title: patchData.title,
    createdAt: patchData.createdAt,
    creator: patchData.creator,
    content: patchData.content,
  };
  const updateDataIdx = db.articles.findIndex((item) => item.id === articleId);
  db.articles.splice(updateDataIdx, 1, newArticle);
  res.json(db);
});

// 뉴스 기사 삭제
app.delete("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  const deleteDataIdx = db.articles.findIndex((item) => item.id === articleId);
  db.articles.splice(deleteDataIdx, 1);
  res.json(db);
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
