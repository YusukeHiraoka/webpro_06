"use strict";
const express = require("express");
const path = require("path"); // ファイルパス用
const app = express();

let bbs = []; // 本来はDBMSを使用するが，今回はこの変数にデータを蓄える
const recipes = []; // レシピデータ（簡易メモリDB）

// 共通設定
app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // JSONリクエストをパース

// 既存のルート
app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1: message1, greet2: message2 });
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1: "Hello world", greet2: "Bon jour" });
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename: "./public/Apple_logo_black.svg", alt: "Apple Logo" });
});

app.get("/luck", (req, res) => {
  const num = Math.floor(Math.random() * 6 + 1);
  let luck = '';
  if (num == 1) luck = '大吉';
  else if (num == 2) luck = '中吉';
  console.log('あなたの運勢は' + luck + 'です');
  res.render('luck', { number: num, luck: luck });
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number(req.query.win);
  let total = Number(req.query.total);
  console.log({ hand, win, total });
  const num = Math.floor(Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'グー';
  else if (num == 2) cpu = 'チョキ';
  else cpu = 'パー';
  // 勝敗判定はダミー
  let judgement = '勝ち';
  win += 1;
  total += 1;
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };
  res.render('janken', display);
});

app.get("/get_test", (req, res) => {
  res.json({
    answer: 0
  });
});

app.get("/add", (req, res) => {
  console.log("GET");
  console.log(req.query);
  const num1 = Number(req.query.num1);
  const num2 = Number(req.query.num2);
  res.json({ answer: num1 + num2 });
});

app.post("/add", (req, res) => {
  console.log("POST");
  console.log(req.body);
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  res.json({ answer: num1 + num2 });
});

// BBS関連
app.post("/check", (req, res) => {
  res.json({ number: bbs.length });
});

app.post("/read", (req, res) => {
  const start = Number(req.body.start);
  console.log("read -> " + start);
  if (start == 0) res.json({ messages: bbs });
  else res.json({ messages: bbs.slice(start) });
});

app.post("/post", (req, res) => {
  const name = req.body.name;
  const message = req.body.message;
  console.log([name, message]);
  bbs.push({ name: name, message: message });
  res.json({ number: bbs.length });
});

app.get("/bbs", (req, res) => {
  console.log("GET /BBS");
  res.json({ test: "GET /BBS" });
});

app.post("/bbs", (req, res) => {
  console.log("POST /BBS");
  res.json({ test: "POST /BBS" });
});

app.get("/bbs/:id", (req, res) => {
  console.log("GET /BBS/" + req.params.id);
  res.json({ test: "GET /BBS/" + req.params.id });
});

app.put("/bbs/:id", (req, res) => {
  console.log("PUT /BBS/" + req.params.id);
  res.json({ test: "PUT /BBS/" + req.params.id });
});

app.delete("/bbs/:id", (req, res) => {
  console.log("DELETE /BBS/" + req.params.id);
  res.json({ test: "DELETE /BBS/" + req.params.id });
});



// レシピ関連
app.post("/recipes/read", (req, res) => {
  const keyword = req.body.keyword || "";
  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.includes(keyword)
  );
  res.json({ recipes: filteredRecipes });
});

app.post("/recipes/add", (req, res) => {
  const { title, ingredients, instructions } = req.body;
  if (!title || !ingredients || !instructions) {
    return res.status(400).json({ error: "全てのフィールドを入力してください。" });
  }
  recipes.push({ title, ingredients, instructions });
  res.json({ message: "レシピが追加されました。" });
});

app.post("/recipes/delete", (req, res) => {
  const { title } = req.body;
  const index = recipes.findIndex(recipe => recipe.title === title);
  if (index === -1) {
    return res.status(404).json({ error: "指定されたレシピが見つかりません。" });
  }
  recipes.splice(index, 1);
  res.json({ message: "レシピが削除されました。" });
});

// サーバー起動
const PORT = 8080;
app.listen(PORT, () => console.log(`サーバーがポート${PORT}で起動しました。`));
