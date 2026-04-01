let offset = 0;
let limit = 10;

async function afficherProduits() {
  document.getElementById("listeProduits").innerHTML = "";
  const response = await fetch(`/api/produits?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    alert("Erreur lors du chargement des produits");
    offset = Math.max(0, offset - limit);
    return;
  }
  const data = await response.json();

  data.forEach((produit) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      ${!username ? "" : `<button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>`}
      <div class="adminbouton">
        ${username === "admin" ? `<button class="delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
      </div>
    `;
    document.getElementById("listeProduits").appendChild(div);
  });
  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.dataset.id;
        await fetch(`/api/produits/${id}`, { method: "DELETE" });
        afficherProduits();
      });
    });
  }
}

async function rechercherProduit() {
  document.getElementById("listeProduits").innerHTML = "";
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
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <div>
        ${!username ? " " : `<button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>`}
      </div>
      <div class="adminbouton">
        ${username === "admin" ? `<button class="delete-btn" data-id="${produit.id}">Supprimer</button>` : ""}
      </div>
    `;
    document.getElementById("listeProduits").appendChild(div);
  });
  if (username === "admin") {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        const id = this.dataset.id;
        await fetch(`/api/produits/${id}`, { method: "DELETE" });
        rechercherProduit();
      });
    });
  }
}

document
  .getElementById("validerRecherche")
  .addEventListener("click", rechercherProduit);

const username = localStorage.getItem("username");

if (username) {
  document.getElementById("auth-buttons").style.display = "none";
  document.getElementById("user-info").innerHTML =
    `Bienvenue ${username} <a href="./dashboard.html"><button id="see-panier">Voir mon panier</button></a> <button id="logout">Se déconnecter</button>`;
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    location.reload();
  });
}

if (username === "admin") {
  document.getElementById("creation").innerHTML = `<form id="createForm">
    <input type="text" id="nom" placeholder="Nom du produit">
    <input type="text" id ="prix" placeholder="Prix du produit">
    <button id="creer">Créer ce produit</button>
  </form>`;
}

const formdiv = document.getElementById("createForm");
if (formdiv) {
  formdiv.addEventListener("submit", CreateProduit);
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
    .then((message) => message.json())
    .then((data) => {
      if (data.message) {
        location.reload();
      } else if (data.error) {
        alert("Erreur de création d'un produit");
      }
    });
}

document.getElementById("next-page").addEventListener("click", function () {
  offset += limit;
  document.getElementById("index-pagination").innerHTML =
    `Page : ${offset / 10}`;
  afficherProduits();
});

document.getElementById("last-page").addEventListener("click", function () {
  if (offset >= limit) {
    offset -= limit;
    document.getElementById("index-pagination").innerHTML =
      `Page : ${offset / 10}`;
    afficherProduits();
  }
});

function ajouterAuPanier(idProduit) {
  fetch("/api/liste/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, idProduit }),
  });
}

afficherProduits();
