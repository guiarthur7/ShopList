async function afficherProduits() {
  const response = await fetch("/api/produits");
  const produits = await response.json();

  produits.forEach((produit) => {
    const div = document.createElement("div");
    div.innerHTML = `
                <p>${produit.name} - ${produit.price}€</p>
                <button onclick="ajouterAuPanier(ID_DU_PRODUIT)">Ajouter</button>
            `;
    document.getElementById("listeProduits").appendChild(div);
  });
}
afficherProduits();

async function rechercherProduit() {
  const valeurRecherche = document.getElementById("recherche").value;
  const response = await fetch(
    `/api/produits?search=${encodeURIComponent(valeurRecherche)}`,
  );
  const produits = await response.json();
  document.getElementById("listeProduits").innerHTML = "";
  produits.forEach((produit) => {
    const div = document.createElement("div");
    div.innerHTML = `
                <p>${produit.name} - ${produit.price}€</p>
                <button onclick="ajouterAuPanier(ID_DU_PRODUIT)">Ajouter</button>
            `;
    document.getElementById("listeProduits").appendChild(div);
  });
}
document
  .getElementById("validerRecherche")
  .addEventListener("click", rechercherProduit);

const username = localStorage.getItem("username");
if (username) {
  document.getElementById("auth-buttons").style.display = "none";
  document.getElementById("user-info").innerHTML =
    `Bienvenue ${username} - <button id="logout">Se déconnecter</button>`;
  document.getElementById("logout").addEventListener("click", function () {
    localStorage.removeItem("username");
    location.reload();
  });
}
