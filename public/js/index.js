document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const ctaGroup = document.getElementById("main-cta");

  if (token) {
    if (ctaGroup) {
      ctaGroup.innerHTML = `<a href="/liste.html" class="btn btn-primary" style="padding: 16px 32px; font-size: 1.1rem;">Accéder aux articles</a>`;
    }
  }

  const phraseArray = [
    "D", "e", "s", " ", "p", "r", "o", "d", "u", "i", "t", "s", " ", "d", "e", " ", "l", "a", " ", "f", "e", "r", "m", "e", ",",
    "<", "b", "r", ">",
    "f", "r", "a", "i", "s", " ", "e", "t", " ", "l", "o", "c", "a", "u", "x", ",", " ", "c", "h", "a", "q", "u", "e", " ", "j", "o", "u", "r", "."
  ];

  const target = document.getElementById("hero-title");
  let i = 0;

  if (target) {
    target.innerHTML = "";

    const timer = setInterval(() => {
      if (i < phraseArray.length) {
        if (phraseArray[i] === "<") {
          target.insertAdjacentHTML("beforeend", "<br>");
          i += 4;
        } else {
          target.insertAdjacentHTML("beforeend", phraseArray[i]);
          i++;
        }
      } else {
        clearInterval(timer);
      }
    }, 60);
  }
});
