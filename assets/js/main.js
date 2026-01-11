document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formulario");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
      nome: formData.get("nome"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      area: formData.get("area")
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwNNNpPf98UCLvzcUUmKXB_i-XnoOkVrQIByBMFRSBjC0oLfSjdyrV3ltBp-Gs9M36i/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Cadastro realizado com sucesso! 🚀");
        form.reset();
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }

    } catch (error) {
      console.error(error);
      alert("Erro de conexão. Tente mais tarde.");
    }
  });
});
