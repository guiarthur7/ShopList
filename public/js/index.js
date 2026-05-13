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
    }  }
});
