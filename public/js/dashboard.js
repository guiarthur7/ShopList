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
  let total = 0;

  data.forEach((item) => {
    const produit = item.id_produit_produit;
    if (!produit) {
      return;
    }

    total += parseFloat(produit.price) || 0;

    const div = document.createElement("div");
    div.className = "product-item";
    div.innerHTML = `
      <p>${produit.name} - ${produit.price}€</p>
      <div class="product-actions">
        <button class="btn btn-logout" onclick="RetirerProduitListe(${produit.id})">Retirer</button>
      </div>
    `;
    listesContainer.appendChild(div);
  });

  const totalElement = document.getElementById("totalPrix");
  if (totalElement) {
    totalElement.textContent = `${total.toFixed(2)}€`;
  }
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
    showToast("Erreur lors de la suppression", "error");
  }
}

AfficherListeProduit();
