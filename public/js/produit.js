const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const token = localStorage.getItem("token");
const username = localStorage.getItem("username");

async function chargerProduit() {
  const loadingDiv = document.getElementById("loading");
  const productContainer = document.getElementById("product-container");
  const errorContainer = document.getElementById("error-container");

  try {
    const response = await fetch("/api/produits?offset=0&limit=1000");

    if (!response.ok) {
      throw new Error("Erreur lors du chargement des produits");
    }

    const produits = await response.json();
    const produit = produits.find((p) => p.id == productId);

    if (!produit) {
      throw new Error("Produit non trouvé");
    }

    document.getElementById("product-name").textContent = produit.name;
    document.getElementById("product-price").textContent = `${produit.price}€`;

    if (produit.description) {
      const descriptionSection = document.getElementById("description-section");
      document.getElementById("product-description").textContent =
        produit.description;
      descriptionSection.style.display = "block";
    }

    // Charger l'image du produit
    await chargerImage(produit.id);

    const actionsContainer = document.getElementById("product-actions");
    actionsContainer.innerHTML = "";

    if (token) {
      const btnAjouter = document.createElement("button");
      btnAjouter.className = "btn btn-primary";
      btnAjouter.textContent = "Ajouter au panier";
      btnAjouter.onclick = () => ajouterAuPanier(produit.id);
      actionsContainer.appendChild(btnAjouter);
    }

    if (username === "admin") {
      const btnModifier = document.createElement("a");
      btnModifier.href = `/modifproduit.html?id=${produit.id}`;
      btnModifier.className = "btn btn-dark";
      btnModifier.textContent = "Modifier";
      actionsContainer.appendChild(btnModifier);

      const btnSupprimer = document.createElement("button");
      btnSupprimer.className = "btn delete-btn";
      btnSupprimer.textContent = "Supprimer";
      btnSupprimer.onclick = async () => {
        const confirmed = await showConfirm(
          "Supprimer le produit ?",
          "Cette action est irréversible. Le produit sera définitivement retiré du catalogue.",
        );
        if (confirmed) {
          try {
            const deleteResponse = await fetch(`/api/produits/${produit.id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (deleteResponse.ok) {
              showToast("Produit supprimé avec succès", "success");
              setTimeout(() => {
                window.location.href = "/liste.html";
              }, 1500);
            } else {
              showToast("Erreur lors de la suppression", "error");
            }
          } catch (error) {
            console.error("Erreur:", error);
            showToast("Erreur lors de la suppression", "error");
          }
        }
      };
      actionsContainer.appendChild(btnSupprimer);
    }

    loadingDiv.style.display = "none";
    productContainer.style.display = "block";
  } catch (error) {
    console.error("Erreur:", error);
    loadingDiv.style.display = "none";

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `
      <strong>Erreur</strong><br>
      ${error.message}<br><br>
      <a href="/liste.html" class="btn btn-dark" style="display: inline-block;">Retourner à la liste</a>
    `;
    errorContainer.appendChild(errorDiv);
  }
}

async function ajouterAuPanier(productId) {
  try {
    const response = await fetch("/api/liste/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username,
        idProduit: productId,
      }),
    });

    if (response.ok) {
      showToast("Produit ajouté au panier", "success");
    } else {
      const error = await response.json();
      showToast(error.message || "Erreur lors de l'ajout", "error");
    }
  } catch (error) {
    console.error("Erreur:", error);
    showToast("Erreur lors de l'ajout au panier", "error");
  }
}

async function chargerImage(productId) {
  const extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
  const imageSection = document.getElementById("product-image-section");
  const imageElement = document.getElementById("product-image");

  for (const ext of extensions) {
    const imagePath = `/produitImages/${productId}${ext}`;
    try {
      const response = await fetch(imagePath, { method: "HEAD" });
      if (response.ok) {
        imageElement.src = imagePath;
        imageSection.style.display = "block";
        return;
      }
    } catch (error) {}
  }
}

document.addEventListener("DOMContentLoaded", chargerProduit);
