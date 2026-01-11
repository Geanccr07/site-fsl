const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");

/* =====================
   UTIL
===================== */
function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

/* Força só números enquanto digita */
whatsappInput.addEventListener("input", () => {
  whatsappInput.value = onlyNumbers(whatsappInput.value);
});

/* =====================
   SUBMIT
===================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const whatsapp = onlyNumbers(whatsappInput.value);
  const area = document.getElementById("area").value;

  /* Validação WhatsApp (DDD + celular) */
  if (whatsapp.length !== 11) {
    alert("Digite um WhatsApp válido com DDD (11 números).");
    whatsappInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbzzdA0Wy4vT2tKaDgm9zIZwUESgdRFjdBUIycGIhEeNCVti_HB0qMFoXuz-GaH8Tspb/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        whatsapp,
        area
      })
    });

    const result = await response.json();

    if (result.status === "success") {
      // 👉 REDIRECIONAMENTO APÓS CONVERSÃO
      window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
    } else {
      alert("Erro ao enviar. Tente novamente.");
      submitBtn.disabled = false;
      submitBtn.innerText = "Acessar comunidade";
    }

  } catch (error) {
    alert("Erro de conexão. Tente novamente.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Acessar comunidade";
  }
});
