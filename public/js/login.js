document.getElementById("loginForm").addEventListener("submit", ValiderCo);

function ValiderCo(event) {
  event.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const url = `api/users/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", data.token);
        window.location.href = "index.html";
      } else if (data.error) {
        alert(data.error);
      }
    })
    .catch(() => alert("Erreur lors de la connexion"));
}
