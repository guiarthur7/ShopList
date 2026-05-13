const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
fetch(`/api/produits/${productId}`)
  .then((res) => {
    if (!res.ok) throw new Error("Produit non trouvé");
    return res.json();
  })
  .then((produit) => {
    document.getElementById("name").value = produit.name;
    document.getElementById("price").value = produit.price;
  })
  .catch((err) => {
    console.error(err);
    alert("Erreur lors du chargement des données du produit");
  });

document.getElementById("editForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const price = document.getElementById("price").value;

  fetch(`/api/produits/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ name, price }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message) {
        window.location.href = "/liste.html";
      } else {
        alert(data.error);
      }
    })
    .catch((err) => alert("Erreur serveur"));
});
