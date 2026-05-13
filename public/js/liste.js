let offset = 0;
let limit = 10;
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

async function afficherProduits() {
  const container = document.getElementById("listeProduits");
  if (!container) return;

  container.innerHTML = "";
  const response = await fetch(`/api/produits?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    showToast("Erreur lors du chargement des produits", "error");
    offset = Math.max(0, offset - limit);
    return;
  }
  const data = await response.json();

  data.forEach((produit) => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <div class="product-actions">
        ${!token ? "" : `<button class="btn btn-primary" onclick="ajouterAuPanier(${produit.id})">Ajouter</button>`}
        ${username === "admin" ? `<button class="btn delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
      </div>
    `;
    container.appendChild(div);
  });

  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async function () {
        const id = this.dataset.id;
        await fetch(`/api/produits/${id}`, { method: "DELETE" });
        afficherProduits();
      };
    });
  }
}

async function rechercherProduit() {
  const container = document.getElementById("listeProduits");
  if (!container) return;

  container.innerHTML = "";
  const valeurRecherche = document.getElementById("recherche").value;
  const response = await fetch(
    `/api/produits/search?search=${encodeURIComponent(valeurRecherche)}&offset=${offset}&limit=${limit}`,
  );
  if (!response.ok) {
    const err = await response.json();
    alert(err.error || "Erreur lors de la recherche");
    return;
  }
  const data = await response.json();
  data.forEach((produit) => {
    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <div class="product-actions">
        ${!token ? "" : `<button class="btn btn-primary" onclick="ajouterAuPanier(${produit.id})">Ajouter</button>`}
        ${username === "admin" ? `<button class="btn delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
      </div>
    `;
    container.appendChild(div);
  });

  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async function () {
        const id = this.dataset.id;
        await fetch(`/api/produits/${id}`, { method: "DELETE" });
        rechercherProduit();
      };
    });
  }
}

const searchBtn = document.getElementById("validerRecherche");
if (searchBtn) {
  searchBtn.addEventListener("click", rechercherProduit);
}

const navActions = document.getElementById("nav-actions");

function updateHeader() {
  if (!navActions) return;

  if (token) {
    navActions.innerHTML = `
      <div class="user-info-wrapper">
        <span class="user-name">${username || "Utilisateur"}</span>
        <a href="./dashboard.html" class="btn btn-primary header-btn" id="see-panier">Panier</a>
        <button class="btn btn-logout header-btn" id="logout">Déconnexion</button>
      </div>
    `;
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.removeItem("username");
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "index.html";
    });
  } else {
    navActions.innerHTML = `
      <div class="auth-buttons-wrapper">
        <a href="login.html" class="btn btn-dark header-btn">Se connecter</a>
        <a href="register.html" class="btn btn-primary header-btn">S'inscrire</a>
      </div>
    `;
  }
}

updateHeader();


if (username === "admin") {
  const creationDiv = document.getElementById("creation");
  if (creationDiv) {
    creationDiv.innerHTML = `<form id="createForm">
      <input type="text" id="nom" placeholder="Nom du produit">
      <input type="text" id ="prix" placeholder="Prix du produit">
      <button id="creer" type="submit" class="btn btn-primary">Créer ce produit</button>
    </form>`;

    const form = document.getElementById("createForm");
    form.addEventListener("submit", CreateProduit);
  }
} else {
  const creationDiv = document.getElementById("creation");
  if (creationDiv) {
    creationDiv.innerHTML = `<p style="text-align: center; color: var(--text-muted); font-style: italic; margin-bottom: 0; margin-top: 20px;">Parcourez notre catalogue et organisez vos achats en quelques clics.</p>`;
  }
}

function CreateProduit(event) {
  event.preventDefault();

  const name = document.getElementById("nom").value;
  const prix = document.getElementById("prix").value;

  fetch("/api/produits/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, prix }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        location.reload();
      } else {
        alert("Erreur de création d'un produit");
      }
    });
}

const nextBtn = document.getElementById("next-page");
if (nextBtn) {
  nextBtn.addEventListener("click", async function () {
    const previousScrollY = window.scrollY;
    offset += limit;
    const pagin = document.getElementById("index-pagination");
    if (pagin) pagin.innerHTML = `Page : ${offset / 10 + 1}`;
    await afficherProduits();
    window.scrollTo(0, previousScrollY);
  });
}

const lastBtn = document.getElementById("last-page");
if (lastBtn) {
  lastBtn.addEventListener("click", async function () {
    if (offset >= limit) {
      const previousScrollY = window.scrollY;
      offset -= limit;
      const pagin = document.getElementById("index-pagination");
      if (pagin) pagin.innerHTML = `Page : ${offset / 10 + 1}`;
      await afficherProduits();
      window.scrollTo(0, previousScrollY);
    }
  });
}

window.ajouterAuPanier = function (idProduit) {
  fetch("/api/liste/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, idProduit }),
  }).then(() => {
    showToast("Produit ajouté au panier !", "success");
  });
};

afficherProduits();
