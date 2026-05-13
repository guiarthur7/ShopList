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
      <a href="/produit.html?id=${produit.id}"><p>-></p></a>
      <div class="product-actions">
        ${!token ? "" : `<button class="btn btn-primary" onclick="ajouterAuPanier(${produit.id})">Ajouter</button>`}
        ${username === "admin" ? `<button class="btn delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
        ${username === "admin" ? `<a href="/modifproduit.html?id=${produit.id}" class="btn btn-warning">Modifier</a>` : ""}
      </div>
    `;
    container.appendChild(div);
  });

  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async function () {
        const id = this.dataset.id;
        if (confirm("Supprimer ce produit ?")) {
          await fetch(`/api/produits/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`, // Protection Middleware
            },
          });
          afficherProduits();
        }
      };
    });
  }
}

async function rechercherProduit() {
  const container = document.getElementById("listeProduits");
  if (!container) return;

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
  container.innerHTML = "";

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
        await fetch(`/api/produits/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        rechercherProduit();
      };
    });
  }
}

function CreateProduit(event) {
  event.preventDefault();

  const name = document.getElementById("nom").value;
  const prix = document.getElementById("prix").value;

  fetch("/api/produits/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, prix }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.id || data.message) {
        location.reload();
      } else {
        alert("Erreur de création du produit");
      }
    });
}

window.ajouterAuPanier = function (idProduit) {
  fetch("/api/liste/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Sécurisé aussi
    },
    body: JSON.stringify({ username, idProduit }),
  }).then(() => {
    showToast("Produit ajouté au panier !", "success");
  });
};

function updateHeader() {
  const navActions = document.getElementById("nav-actions");
  if (!navActions) return;

  if (token) {
    navActions.innerHTML = `
      <div class="user-info-wrapper">
        <span class="user-name">${username || "Utilisateur"}</span>
        <a href="./dashboard.html" class="btn btn-primary header-btn">Panier</a>
        <button class="btn btn-logout header-btn" id="logout">Déconnexion</button>
      </div>
    `;
    document.getElementById("logout").addEventListener("click", function () {
      localStorage.clear();
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
    creationDiv.innerHTML = `
    <form id="createForm">
      <input type="text" id="nom" placeholder="Nom du produit" required>
      <input type="number" id="prix" placeholder="Prix" step="0.01" required>
      <button type="submit" class="btn btn-primary">Créer</button>
    </form>`;
    document
      .getElementById("createForm")
      .addEventListener("submit", CreateProduit);
  }
}

// Pagination
const nextBtn = document.getElementById("next-page");
if (nextBtn) {
  nextBtn.addEventListener("click", async () => {
    offset += limit;
    await afficherProduits();
  });
}

const lastBtn = document.getElementById("last-page");
if (lastBtn) {
  lastBtn.addEventListener("click", async () => {
    if (offset >= limit) {
      offset -= limit;
      await afficherProduits();
    }
  });
}

const searchBtn = document.getElementById("validerRecherche");
if (searchBtn) {
  searchBtn.addEventListener("click", rechercherProduit);
}

afficherProduits();
