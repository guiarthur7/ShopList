async function afficherProduits() {
  document.getElementById("listeProduits").innerHTML = "";
  const response = await fetch("/api/produits");
  const produits = await response.json();

  produits.forEach((produit) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>
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
    `/api/produits?search=${encodeURIComponent(valeurRecherche)}`,
  );
  const produits = await response.json();
  produits.forEach((produit) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <button onclick="ajouterAuPanier(${produit.id})">Ajouter</button>
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
    `Bienvenue ${username} | <button id="logout">Se déconnecter</button>`;
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

afficherProduits();
