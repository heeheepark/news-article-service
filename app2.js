// DB없는 모드

const express = require("express");
const app = express();

let idNum = 1;
let commentIdNum = 3;

const db = {
  articles: [
    {
      id: 1,
      cateId: 1,
      title: "1111",
      createdAt: "2023-11-14 17:30:30",
      creator: "박주희",
      content: "내용",
      commentsId: [],
    },
  ],
};

const commentDb = {
  comments: [],
};

app.set("port", process.env.PORT || 3000);
app.use(express.json());

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});

app.get("/", (req, res) => {
  res.json("Hello, World");
});

// 전체 기사 조회
app.get("/articles", (req, res) => {
  res.json(db);
});

// 기사 세부 조회
app.get("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  try {
    const findArticleData = db.articles.find(
      (article) => article.id === articleId
    );
    if (findArticleData) {
      res.json(findData);
    } else {
      res.status(400).json({ status: 400, message: "Bad Request" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

// 뉴스 기사 추가
app.post("/articles", (req, res) => {
  const postData = req.body;
  try {
    if (
      typeof postData.cateId !== "string" &&
      typeof postData.title === "string" &&
      typeof postData.createdAt === "string" &&
      typeof postData.creator === "string" &&
      typeof postData.content === "string"
    ) {
      if (
        postData.cateId > 0 &&
        postData.cateId < 8 &&
        postData.title.trim().length > 0 &&
        postData.title.length < 256 &&
        postData.createdAt.length === 19 &&
        postData.creator.trim().length > 0 &&
        postData.creator.length < 6 &&
        postData.content.trim().length > 0
      ) {
        const newArticle = {
          id: idNum,
          ...postData,
        };
        db.articles.push(newArticle);
        idNum += 1;
        res.json({
          meassage: "게시글이 등록되었습니다.",
          articles: db.articles,
        });
      } else {
        res.status(400).json({ status: 400, message: "Bad Request" });
      }
    } else {
      res.status(400).json({ status: 400, message: "Bad Request" });
    }
  } catch (err) {
    res.status(500).json({ status: 500, messsage: "Internal Server Error" });
  }
});

// 뉴스 기사 수정
app.patch("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  const patchData = req.body;
  try {
    const findArticleData = db.articles.find(
      (article) => article.id === articleId
    );
    if (findArticleData) {
      if (
        typeof postData.cateId !== "string" &&
        typeof postData.title === "string" &&
        typeof postData.createdAt === "string" &&
        typeof postData.creator === "string" &&
        typeof postData.content === "string" &&
        postData.cateId > 0 &&
        postData.cateId < 8 &&
        postData.title.trim().length > 0 &&
        postData.title.length < 256 &&
        postData.createdAt.length === 19 &&
        postData.creator.trim().length > 0 &&
        postData.creator.length < 6 &&
        postData.content.trim().length > 0
      ) {
        findArticleData.cateId = patchData.cateId;
        findArticleData.title = patchData.title;
        findArticleData.createdAt = patchData.createdAt;
        findArticleData.creator = patchData.creator;
        findArticleData.content = patchData.content;
        res.json({
          message: "게시글이 수정되었습니다.",
          articles: db.articles,
        });
      } else {
        res.status(400).json({ status: 400, message: "Bad Request" });
      }
    } else {
      res
        .status(404)
        .json({ status: 400, message: "존재하지 않는 기사입니다." });
    }
  } catch (err) {
    res.status(500).json({ status: 500, message: "Internal Server Error" });
  }
});

// 뉴스 기사 삭제
app.delete("/articles/:id", (req, res) => {
  const articleId = parseInt(req.params.id);
  try {
    const deleteDataIdx = db.articles.findIndex(
      (article) => article.id === articleId
    );
    if (deleteDataIdx !== -1) {
      db.articles.splice(deleteDataIdx, 1);
      res.json({ message: "게시글이 삭제되었습니다." });
    } else {
      res
        .status(404)
        .json({ status: 404, message: "존재하지 않는 기사입니다." });
    }
  } catch (err) {
    res.status(500).json({ status: 500, massage: "Internal Server Error" });
  }
});

// 덧글 조회
app.get("/articles/:id/comments", (req, res) => {
  const articleId = parseInt(req.params.id);
  const findArticleData = db.articles.find(
    (article) => article.id === articleId
  );
  console.log(findArticleData);
  if (findArticleData) {
    const commentsIdArray = findArticleData.commentsId;
    const commentsData = commentsIdArray?.map((commentId) =>
      commentDb.comments.find((comment) => comment.id === commentId)
    );
    res.json({ articleId: articleId, comments: commentsData });
  } else {
    res.status(404).json({ status: 404, message: "존재하지 않는 기사입니다." });
  }
});

// 덧글 등록
app.post("/articles/:id/comments", (req, res) => {
  const articleId = parseInt(req.params.id);
  const postData = req.body;
  const findArticleData = db.articles.find(
    (article) => article.id === articleId
  );
  if (findArticleData) {
    const newComment = {
      id: commentIdNum,
      articleId: articleId,
      createdAt: postData.createdAt,
      content: postData.content,
    };
    commentDb.comments.push(newComment);
    findArticleData.commentsId.push(commentIdNum);
    res.json({
      message: "덧글이 등록되었습니다.",
      articleId: articleId,
      comments: newComment,
    });
    commentIdNum += 1;
  } else {
    res.status(404).json({ status: 400, message: "존재하지 않는 기사입니다." });
  }
});

// 덧글 수정
app.patch("/articles/:id/comments/:commentId", (req, res) => {
  const articleId = parseInt(req.params.id);
  const commentId = parseInt(req.params.commentId);
  const patchData = req.body;
  const findCommentData = commentDb.comments.find(
    (comment) => comment.id === commentId
  );
  if (findCommentData) {
    findCommentData.createdAt = patchData.createdAt;
    findCommentData.content = patchData.content;
    res.json({
      message: "덧글이 수정되었습니다.",
      articleId: articleId,
      comments: findCommentData,
    });
  } else {
    res.status(404).json({ status: 404, message: "존재하지 않는 덧글입니다." });
  }
});

// 덧글 삭제
app.delete("/articles/:id/comments/:commentId", (req, res) => {
  const articleId = parseInt(req.params.id);
  const commentId = parseInt(req.params.commentId);
  const findArticleData = db.articles.find(
    (article) => article.id === articleId
  );
  const findCommentIdx = commentDb.comments.findIndex(
    (comment) => comment.id === commentId
  );
  if (findArticleData && findCommentIdx !== -1) {
    commentDb.comments.splice(findCommentIdx, 1);
    const deleteCommentIdx = findArticleData.commentsId.findIndex(
      (comment) => comment === commentId
    );
    findArticleData.commentsId.splice(deleteCommentIdx, 1);
    res.json({ message: "덧글이 삭제되었습니다." });
  }
});
