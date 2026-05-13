document
  .getElementById("registerForm")
  .addEventListener("submit", ValiderInscription);

function ValiderInscription(event) {
  event.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/users/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
        window.location.href = "liste.html";
      } else if (data.error) {
        showToast(data.error, "error");
      }
    })
    .catch(() => showToast("Erreur lors de l'inscription", "error"));
}
