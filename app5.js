const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  else if( num==3 ) luck = '吉';
  else if( num==4 ) luck = '小吉';
  else if( num==5 ) luck = '末吉';
  else if( num==6 ) luck = '凶';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  if (isNaN(win)) {
    win = 0;
  }
  if (isNaN(total)) {
    total = 0;
  }
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  let judgement ='';
  if(hand == cpu){
    judgement='引き分け';
    total ++;
  } else if (
    (hand == 'グー' && cpu =='チョキ')||
    (hand == 'パー' && cpu == 'グー')||
    (hand == 'チョキ' && cpu == 'パー')
  ){
    judgement='勝ち';
    win++;
    total++;
  }
  else{judgement='負け';
    total++;
  }
  
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/animal", (req, res) => {
  let animal = req.query.animal;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  if (isNaN(win)) {
    win = 0;
  }
  if (isNaN(total)) {
    total = 0;
  }
  console.log( {animal, win, total} );

  const num = Math.floor( Math.random() * 3 + 1);
  let cpu = '';
  if (num == 1) cpu = 'ライオン';
  else if (num == 2) cpu = 'ゾウ';
  else cpu = 'カンガルー';

  let judgement = '';
  if (animal == cpu) {
    judgement = '引き分け';
    total++;
  } else if (
    (animal == 'ライオン' && cpu == 'ゾウ') ||
    (animal == 'カンガルー' && cpu == 'ライオン') ||
    (animal == 'ゾウ' && cpu == 'カンガルー')
  ) {
    judgement = '勝ち';
    win++;
    total++;
  } else {judgement = '負け';
    total++;
  }

  const display = {
    your: animal,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  };

  res.render('animal', display);
});


app.get("/planet", (req, res) => {
  const question = "次のうち、最も大きい惑星はどれですか？";
  const choices = ["地球", "火星", "木星", "金星"];
  const correctAnswer = "木星";

  let userAnswer = req.query.answer; // ユーザーの回答を取得
  let result = null;

  if (userAnswer) {
    if (userAnswer === correctAnswer) {
      result = "正解です！";
    } else {
      result = "不正解。正解は「木星」です！";
    }
  }

  const display = {
    question: question,
    choices: choices,
    result: result,
    userAnswer: userAnswer,
  };

  res.render("planet", display);
});
app.listen(8080, () => console.log("Example app listening on port 8080!"));
