document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const nav = document.getElementById("nav-actions");
  const ctaGroup = document.getElementById("main-cta");

  if (token) {
    if (nav) {
      nav.innerHTML = `
                <div class="user-info-wrapper">
                    <a href="/dashboard.html" class="btn btn-primary header-btn">Mon Panier</a>
                    <button id="logout-btn" class="btn btn-logout header-btn">Déconnexion</button>
                </div>
            `;

      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("username");
          window.location.reload();
        });
      }
    }

    if (ctaGroup) {
      ctaGroup.innerHTML = `<a href="/liste.html" class="btn btn-primary" style="padding: 16px 32px; font-size: 1.1rem;">Accéder aux articles</a>`;
    }
  }

  const phraseArray = [
    "S",
    "i",
    "m",
    "p",
    "l",
    "i",
    "f",
    "i",
    "e",
    "z",
    " ",
    "v",
    "o",
    "s",
    " ",
    "c",
    "o",
    "u",
    "r",
    "s",
    "e",
    "s",
    ",",
    "<",
    "b",
    "r",
    ">",
    "m",
    "a",
    "î",
    "t",
    "r",
    "i",
    "s",
    "e",
    "z",
    " ",
    "v",
    "o",
    "t",
    "r",
    "e",
    " ",
    "b",
    "u",
    "d",
    "g",
    "e",
    "t",
    ".",
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
