let Foods = {};
let shown = { happy: [], sad: [], tired: [], angry: [] };

const SITE_URL = 'https://makermuru.github.io/Menu-O-Matic/ko-kr/';

fetch("krfoods.json")
  .then(res => res.json())
  .then(data => { Foods = data; });

const btns      = document.querySelectorAll(".liquid[data-f]");
const r         = document.getElementById("r");
const sound     = document.getElementById("sound");
const shareBtn  = document.getElementById("share-btn");
const themeBtn  = document.getElementById("theme-btn");
const html      = document.documentElement;

let curMood = null;
let curFood = null;

/* ── 테마 토글 ── */
function getTheme() { return html.getAttribute("data-theme"); }

function applyTheme(theme) {
  html.setAttribute("data-theme", theme);
  themeBtn.textContent = theme === "dark" ? "☀️ 라이트" : "🌙 다크";
  localStorage.setItem("theme", theme);
}

/* 저장된 테마 불러오기 */
const saved = localStorage.getItem("theme");
if (saved) applyTheme(saved);

themeBtn.addEventListener("click", () => {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
});

/* ── 중복 없는 랜덤 ── */
function getFood(f) {
  const pool = Foods[f];
  if (!pool || pool.length === 0) return null;

  if (shown[f].length >= pool.length) shown[f] = [];

  const remaining = pool.filter(item => !shown[f].includes(item));
  const pick = remaining[Math.floor(Math.random() * remaining.length)];
  shown[f].push(pick);
  return pick;
}

/* ── 기분 버튼 클릭 ── */
btns.forEach(btn => {
  btn.addEventListener("click", () => {
    sound.currentTime = 0;
    sound.play();

    const f = btn.dataset.f;
    const food = getFood(f);
    if (!food) return;

    curMood = f;
    curFood = food;

    r.classList.remove("pop");
    void r.offsetWidth;
    r.classList.add("pop");
    r.innerText = food + "!";

    shareBtn.style.display = "";
  });
});

r.addEventListener("animationend", () => r.classList.remove("pop"));

/* ── 공유하기 ── */
shareBtn.addEventListener("click", () => {
  if (!curFood) return;

  const messages = {
    happy: `😄 오늘 기분 최고라 ${curFood} 먹기로 했어ㅋㅋ`,
    sad:   `😢 슬플 때는... ${curFood}이지... 같이 먹을 사람?`,
    tired: `😓 너무 힘들어서 ${curFood} 먹으러 간다`,
    angry: `😡 화가 너무 나서 ${curFood} 먹으러 감. 건들지 마`
  };

  const text = messages[curMood] + '\n\n👉 나도 해보기: ' + SITE_URL;

  if (navigator.share) {
    navigator.share({ title: '오늘 뭐먹지?', text, url: SITE_URL }).catch(() => {});
  } else {
    navigator.clipboard.writeText(text).then(() => {
      const prev = shareBtn.innerText;
      shareBtn.innerText = '복사됐어요! ✅';
      setTimeout(() => { shareBtn.innerText = prev; }, 2000);
    });
  }
});