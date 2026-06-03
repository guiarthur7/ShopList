document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const nav = document.getElementById("nav-actions");

  if (nav) {
    if (token) {
      nav.innerHTML = `
                <div class="user-info-wrapper">
                    <a href="/dashboard.html" class="btn btn-primary header-btn">Mon Panier</a>
                    <button id="logout-btn" class="btn btn-logout header-btn">Déconnexion</button>
                </div>
            `;

      const logoutBtn = document.getElementById("logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          localStorage.clear();
          window.location.href = "/index.html";
        });
      }
    } else {
      nav.innerHTML = `
                <div class="auth-buttons-wrapper">
                    <a href="/login.html" class="btn header-btn">Connexion</a>
                    <a href="/register.html" class="btn btn-primary header-btn">S'inscrire</a>
                </div>
            `;
    }
  }
});
