let Foods = {};

fetch("krfoods.json")
  .then(res => res.json())
  .then(data => {
    Foods = data;
  });

const btn = document.querySelectorAll(".liquid");
const r = document.getElementById("r");
const sound = document.getElementById("sound");

btn.forEach(button => {
  button.addEventListener("click", () => {
    navigator.vibrate && navigator.vibrate(100);
    sound.play();

    const f = button.dataset.f;
    const foodline = Foods[f];

    const i = Math.floor(Math.random() * foodline.length);
    r.innerText = foodline[i] + "!";
  });
});
