const token = localStorage.getItem("token");

const form = document.getElementById("createForm");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("nom").value.trim();
  const prix = document.getElementById("prix").value;
  const description = document.getElementById("description").value.trim();
  const imageFile = document.getElementById("image").files[0];

  if (!name || !prix) {
    showToast("Veuillez remplir tous les champs", "error");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("prix", prix);
    formData.append("description", description);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const response = await fetch("/api/produits/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok && (data.id || data.message)) {
      showToast("Produit créé avec succès !", "success");
      setTimeout(() => {
        window.location.href = "/liste.html";
      }, 1500);
    } else {
      showToast(data.error || "Erreur lors de la création", "error");
    }
  } catch (error) {
    console.error("Erreur:", error);
    showToast("Erreur lors de la création du produit", "error");
  }
});
