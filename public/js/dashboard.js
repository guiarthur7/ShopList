const username = localStorage.getItem("username");
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "index.html";
}

function renderCartProductHTML(produit) {
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
      <button class="btn btn-logout" onclick="RetirerProduitListe(${produit.id})">Retirer</button>
    </div>
  `;
}

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
    div.innerHTML = renderCartProductHTML(produit);
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
