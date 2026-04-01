const username = localStorage.username;

async function AfficherListeProduit() {
  const listesContainer = document.getElementById("listeProduits");

  listesContainer.innerHTML = "";

  const response = await fetch("/api/liste/see", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  const data = await response.json();

  data.forEach((item) => {
    const produit = item.id_produit_produit;
    if (!produit) {
      return;
    }

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <button onclick="RetirerProduitListe(${produit.id})">Retirer</button>
    `;
    listesContainer.appendChild(div);
  });
}

async function RetirerProduitListe(idProduit) {
  const response = await fetch("/api/liste/del", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, idProduit }),
  });
  if (response) {
    AfficherListeProduit();
  } else {
    alert("erreur lors de la suppression");
  }
}

AfficherListeProduit();
