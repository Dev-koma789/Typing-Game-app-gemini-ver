"use strict";

/**
 * 1. データの準備
 * ゲームで使う「言葉」「状態」「画面のパーツ」を変数に保存します。
 */
const words = ["javascript", "blue", "frontend", "coding", "happy"];
let target; // 現在のお題（例：'apple'）
let loc; // 今何文字目まで打ったか（locationの略）
let score; // 正解した単語数
let startTime; // 開始した時刻（Date.now()を入れる）
let isPlaying = false; // ゲーム中かどうかを判断する旗（フラグ）

// HTMLの各パーツ（要素）をJavaScriptで操作できるように取得
const timerLabel = document.getElementById("timer");
const scoreLabel = document.getElementById("score");
const wordLabel = document.getElementById("word");
const messageLabel = document.getElementById("message");

/**
 * 2. ゲーム開始処理
 */
function startGame() {
  isPlaying = true; // ゲーム中モードに変更
  loc = 0; // 文字の位置をリセット
  score = 0; // スコアをリセット

  // Date.now() で「1970年からの経過ミリ秒」を取得し、開始時刻としてメモ
  startTime = Date.now();

  // 画面の数字などをリセット
  scoreLabel.textContent = score;
  messageLabel.textContent = "Keep typing!";

  setWord(); // 最初のお題をセット
  updateTimer(); // タイマーを動かし始める
}

/**
 * 3. お題のセット
 */
function setWord() {
  // words配列からランダムに一つ選ぶ
  target = words[Math.floor(Math.random() * words.length)];
  render(); // 画面に表示
}

/**
 * 4. 画面への表示（描画）
 * 打った文字と打っていない文字を切り分けて色を変える。
 */
function render() {
  // substring(開始位置, 終了位置) で文字を切り出す
  // すでに打ち終わった文字（0番目からloc番目まで）
  const typed = target.substring(0, loc);
  // これから打つ文字（loc番目から最後まで）
  const untyped = target.substring(loc);

  // <span>タグを差し込んで、CSSで色を塗れるようにHTMLを組み立てる
  wordLabel.innerHTML = `<span class="typed">${typed}</span>${untyped}`;
}

/**
 * 5. タイマー更新（再帰呼び出し）
 */
function updateTimer() {
  /**
   * 【重要：時間計算の仕組み】
   * 1. Date.now() - startTime = ゲーム開始から今までの「経過ミリ秒」
   * 2. それを 1000 で割って「秒」に変換
   * 3. 制限時間の 10.0秒 から引くことで「残り秒数」を出す
   */
  const timeLeft = 10.0 - (Date.now() - startTime) / 1000;

  // toFixed(2) で小数点以下2桁まで表示
  timerLabel.textContent = timeLeft.toFixed(2);

  // 0秒以下になったらゲーム終了
  if (timeLeft <= 0) {
    isPlaying = false;
    timerLabel.textContent = "0.00";
    wordLabel.textContent = "FINISHED!";
    messageLabel.textContent = "Press Space to Retry";
    return; // 関数を抜ける
  }

  // ゲーム中なら、約10ミリ秒後にもう一度自分（updateTimer）を呼び出す
  if (isPlaying) {
    setTimeout(updateTimer, 10);
  }
}

/**
 * 6. キーボード入力の監視
 */
window.addEventListener("keydown", (e) => {
  // スペースキーが押された、かつゲーム中ではない場合に開始
  if (!isPlaying && e.code === "Space") {
    startGame();
    return;
  }

  // ゲーム中でなければ、ここから下の処理は無視する
  if (!isPlaying) return;

  // もし入力されたキー (e.key) が、現在狙っている文字 (target[loc]) と一致したら
  if (e.key === target[loc]) {
    loc++; // 次の文字へ

    // 単語の最後まで打ち終わったら
    if (loc === target.length) {
      score++; // スコア加算
      scoreLabel.textContent = score;
      loc = 0; // 次の単語のために位置をリセット
      setWord(); // 新しい単語をセット
    }
    render(); // 画面を更新
  } else {
    /**
     * ミスした時の演出
     * 1. <body>にmissクラスを付けて背景を赤くする
     * 2. 100ミリ秒後に自動でクラスを外して元の色に戻す
     */
    document.body.classList.add("miss");
    setTimeout(() => document.body.classList.remove("miss"), 100);
  }
});
