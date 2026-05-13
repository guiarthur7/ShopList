document.getElementById("loginForm").addEventListener("submit", ValiderCo);

function ValiderCo(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/users/login", {
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
    .catch(() => showToast("Erreur lors de la connexion", "error"));
}
