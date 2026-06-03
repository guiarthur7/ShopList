function showToast(message, type = "info", duration = 3000) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<div class="toast-content">${message}</div>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("fade-out");
    setTimeout(() => {
      toast.remove();
      if (container.childNodes.length === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}

/**
 * Affiche une boîte de dialogue de confirmation personnalisée
 * @param {string} title Titre du message
 * @param {string} message Description
 * @returns {Promise<boolean>}
 */
function showConfirm(title, message) {
  return new Promise((resolve) => {
    // Création de l'overlay
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    // Création de la carte
    overlay.innerHTML = `
      <div class="modal-card">
        <h2>${title}</h2>
        <p>${message}</p>
        <div class="modal-buttons">
          <button class="modal-btn modal-btn-cancel" id="confirm-cancel">Annuler</button>
          <button class="modal-btn modal-btn-confirm" id="confirm-ok">Confirmer</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Animation d'ouverture
    setTimeout(() => overlay.classList.add("active"), 10);

    const close = (result) => {
      overlay.classList.remove("active");
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 300);
    };

    document.getElementById("confirm-ok").onclick = () => close(true);
    document.getElementById("confirm-cancel").onclick = () => close(false);
    overlay.onclick = (e) => {
      if (e.target === overlay) close(false);
    };
  });
}

window.alert = (msg) => showToast(msg);
