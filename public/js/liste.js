let offset = 0;
let limit = 12;
const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

function renderProductHTML(produit) {
  return `
    <img src="/produitImages/${produit.id}.jpg" 
         class="product-thumbnail" 
         onerror="this.onerror=null; this.src='/produitImages/${produit.id}.png'; this.onerror=function(){this.onerror=null; this.src='/produitImages/${produit.id}.webp'; this.onerror=function(){this.onerror=null; this.src='/produitImages/default.png';}};"
         alt="${produit.name}">
    <div class="product-info">
      <div class="product-details">
        <h3 class="product-name">${produit.name}</h3>
        <p class="product-price">${produit.price}€</p>
      </div>
    </div>
    <div class="product-actions">
      ${!token ? "" : `<button class="btn btn-primary" onclick="event.stopPropagation(); ajouterAuPanier(${produit.id})">Ajouter</button>`}
      ${username === "admin" ? `<button class="btn delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
      ${username === "admin" ? `<a href="/modifproduit.html?id=${produit.id}" class="btn btn-dark" onclick="event.stopPropagation()">Modifier</a>` : ""}
    </div>
  `;
}

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
    div.style.cursor = "pointer";
    div.onclick = function (e) {
      if (
        e.target.tagName !== "BUTTON" &&
        e.target.tagName !== "A" &&
        !e.target.closest("button") &&
        !e.target.closest("a")
      ) {
        window.location.href = `/produit.html?id=${produit.id}`;
      }
    };
    div.innerHTML = renderProductHTML(produit);
    container.appendChild(div);
  });

  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async function (e) {
        e.stopPropagation();
        const id = this.dataset.id;
        const confirmed = await showConfirm(
          "Supprimer le produit ?",
          "Cette action est irréversible. Le produit sera définitivement retiré du catalogue.",
        );
        if (confirmed) {
          await fetch(`/api/produits/${id}`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
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
    div.style.cursor = "pointer";
    div.onclick = function (e) {
      if (
        e.target.tagName !== "BUTTON" &&
        e.target.tagName !== "A" &&
        !e.target.closest("button") &&
        !e.target.closest("a")
      ) {
        window.location.href = `/produit.html?id=${produit.id}`;
      }
    };
    div.innerHTML = renderProductHTML(produit);
    container.appendChild(div);
  });

  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.onclick = async function (e) {
        e.stopPropagation();
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

window.ajouterAuPanier = function (idProduit) {
  fetch("/api/liste/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ username, idProduit }),
  }).then(() => {
    showToast("Produit ajouté au panier !", "success");
  });
};

if (username === "admin") {
  const creationDiv = document.getElementById("creation");
  if (creationDiv) {
    creationDiv.innerHTML = `
    <div style="margin-bottom: 2rem; text-align: center;">
      <a href="/creer_produit.html" class="btn btn-primary" style="display: inline-block; width: auto;">Ajouter un produit</a>
    </div>`;
  }
}

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
