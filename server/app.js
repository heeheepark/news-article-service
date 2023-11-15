const express = require("express");
const app = express();
app.set("port", process.env.PORT || 3000);
app.use(express.json());

let articleIdNum = 2;
let commentIdNum = 2;

// article DB
const articleDb = {
  articles: [
    {
      id: 1,
      cateId: 5,
      title:
        "'오사개' 잦은 결방→시청률 하락 주1회 방영 쓴맛 봤나..연속편성 대책",
      createdAt: "2023-11-14 15:48:30",
      creator: "강가희",
      content:
        "오늘도 사랑스럽개' 측이 이번주 2회 연속 방송을 결정했다. 주1회 방영의 치명적 단점을 겪어서일까. 극의 흐름을 이어가려고 노력하고 있다. MBC 수요드라마 '오늘도 사랑스럽개'(이하 '오사개')는 키스를 하면 개로 변하는 저주에 걸린 여자 해나(박규영 분)와 그 저주를 풀 수 있는 유일한 치트키지만 개를 무서워하는 남자 서원(차은우 분)의 '댕며드는' 예측불허 판타지 로맨스 드라마. 동명의 인기 웹툰을 원작으로 한 만큼 방영 전부터 드라마에 대한 기대감이 높았으나, 주1회 방송이라는 치명적 단점을 안고 가야 했다. 제작 환경은 나아졌지만 그만큼 방영 기간이 길어져 시청자들의 몰입을 방해하고, 한 번의 결방이 오랜 공백으로 이어져 극 중 흐름을 끊어내기 때문. 앞서 지난 8월 매주 목요일 주1회 편성으로 첫 방송 됐던 SBS '국민사형투표'는 '항저우 아시안게임', '플레이오프 3차전' 중계 여파로 잦은 결방을 겪어야만 했고, 15주 간의 대장정 끝에 오는 16일 마지막 방송을 앞두고 있다.",
      commentsId: [1],
    },
  ],
};

// comment DB
const commentDb = {
  comments: [
    {
      id: 1,
      articleId: 1,
      createdAt: "2023-11-14 16:02:10",
      content: "오사개 화이팅!",
    },
  ],
};

// 데이터 검증
const verifyArticleData = (data) => {
  return (
    typeof data.cateId === "number" &&
    typeof data.title === "string" &&
    typeof data.createdAt === "string" &&
    typeof data.creator === "string" &&
    typeof data.content === "string" &&
    data.cateId > 0 &&
    data.cateId < 8 &&
    data.title.trim().length > 0 &&
    data.title.length < 256 &&
    data.createdAt.length === 19 &&
    data.creator.trim().length > 0 &&
    data.creator.length < 6 &&
    data.content.trim().length > 0
  );
};

const verifyCommentData = (data) => {
  return (
    typeof data.createdAt === "string" &&
    typeof data.content === "string" &&
    data.createdAt.length === 19 &&
    data.content.trim().length > 0 &&
    data.content.length < 501
  );
};

app.get("/", (req, res) => {
  res.json("Hello, World");
});

// 전체 기사 조회
app.get("/articles", (req, res) => {
  const articleCate = req.query.category;
  if (articleCate) {
    const articles = articleDb.articles;
    const articlesFilter = (cateId) => {
      return articles.filter((article) => article.cateId === cateId);
    };
    switch (articleCate) {
      case "society":
        const societyData = articlesFilter(1);
        res.json({ ...articleDb, articles: societyData });
        break;
      case "politics":
        const politicsData = articlesFilter(2);
        res.json({ ...articleDb, articles: politicsData });
        break;
      case "economy":
        const economyData = articlesFilter(3);
        res.json({ ...articleDb, articles: economyData });
        break;
      case "science":
        const scienceData = articlesFilter(4);
        res.json({ ...articleDb, articles: scienceData });
        break;
      case "entertainment":
        const entertainmentData = articlesFilter(5);
        res.json({ ...articleDb, articles: entertainmentData });
        break;
      case "sports":
        const sportsData = articlesFilter(6);
        res.json({ ...articleDb, articles: sportsData });
        break;
      case "exclusivity":
        const exclusivityData = articlesFilter(7);
        res.json({ ...articleDb, articles: exclusivityData });
        break;
    }
  } else {
    const sortArticleData = articleDb.articles.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json({ ...articleDb, articles: sortArticleData });
  }
});

// 기사 세부 조회
app.get("/articles/:articleId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const findArticleData = articleDb.articles.find(
    (article) => article.id === articleId
  );
  if (findArticleData) {
    res.json(findArticleData);
  } else {
    res
      .status(400)
      .json({ status: 400, message: "데이터 값에 오류가 있습니다." });
  }
});

// 뉴스 기사 추가
app.post("/articles", (req, res) => {
  const postData = req.body;
  if (verifyArticleData(postData)) {
    const newArticle = {
      id: articleIdNum,
      ...postData,
    };
    articleDb.articles.push(newArticle);
    res.json({
      meassage: "게시글이 등록되었습니다.",
      article: [{ id: articleIdNum, ...newArticle }],
    });
    articleIdNum += 1;
  } else {
    res
      .status(400)
      .json({ status: 400, message: "데이터 값에 오류가 있습니다." });
  }
});

// 뉴스 기사 수정
app.put("/articles/:articleId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const patchData = req.body;
  const findArticleData = articleDb.articles.find(
    (article) => article.id === articleId
  );
  if (findArticleData) {
    if (verifyArticleData(patchData)) {
      findArticleData.cateId = patchData.cateId;
      // findArticleData.cateId = patchData.cateId ?? findArticleData.cateId;
      // findArticleData.cateId = patchData.cateId ? findArticleData.cateId : patchData.cateId;
      findArticleData.title = patchData.title;
      findArticleData.createdAt = patchData.createdAt;
      findArticleData.creator = patchData.creator;
      findArticleData.content = patchData.content;
      res.json({
        message: "게시글이 수정되었습니다.",
        articles: articleDb.articles,
      });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "데이터 값에 오류가 있습니다." });
    }
  } else {
    res.status(404).json({ status: 400, message: "존재하지 않는 기사입니다." });
  }
});

// 뉴스 기사 삭제
app.delete("/articles/:articleId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const deleteDataIdx = articleDb.articles.findIndex(
    (article) => article.id === articleId
  );
  if (deleteDataIdx !== -1) {
    articleDb.articles.splice(deleteDataIdx, 1);
    res.json({ message: "게시글이 삭제되었습니다." });
  } else {
    res.status(404).json({ status: 404, message: "존재하지 않는 기사입니다." });
  }
});

// 덧글 조회
app.get("/articles/:articleId/comments", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const findArticleData = articleDb.articles.find(
    (article) => article.id === articleId
  );
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
app.post("/articles/:articleId/comments", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const postData = req.body;
  const findArticleData = articleDb.articles.find(
    (article) => article.id === articleId
  );
  if (findArticleData) {
    if (verifyCommentData(postData)) {
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
      res
        .status(400)
        .json({ status: 400, message: "데이터 값에 오류가 있습니다." });
    }
  } else {
    res.status(404).json({ status: 400, message: "존재하지 않는 기사입니다." });
  }
});

// 덧글 수정
app.patch("/articles/:articleId/comments/:commentId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const commentId = parseInt(req.params.commentId);
  const patchData = req.body;
  const findCommentData = commentDb.comments.find(
    (comment) => comment.id === commentId
  );
  if (findCommentData) {
    if (verifyCommentData(patchData)) {
      findCommentData.createdAt = patchData.createdAt;
      findCommentData.content = patchData.content;
      res.json({
        message: "덧글이 수정되었습니다.",
        articleId: articleId,
        comments: findCommentData,
      });
    } else {
      res
        .status(400)
        .json({ status: 400, message: "데이터 값에 오류가 있습니다." });
    }
  } else {
    res.status(404).json({ status: 404, message: "존재하지 않는 덧글입니다." });
  }
});

// 덧글 삭제
app.delete("/articles/:articleId/comments/:commentId", (req, res) => {
  const articleId = parseInt(req.params.articleId);
  const commentId = parseInt(req.params.commentId);
  const findArticleData = articleDb.articles.find(
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
  } else {
    res
      .status(404)
      .json({ status: 404, message: "존재하지 않는 기사/덧글입니다." });
  }
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
