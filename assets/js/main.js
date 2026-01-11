const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");

/* =====================
   UTIL
===================== */
function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

/* Força apenas números no WhatsApp */
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

  /* Validação WhatsApp BR */
  if (whatsapp.length !== 11) {
    alert("Digite um WhatsApp válido com DDD (11 números).");
    whatsappInput.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby6pVcpFOqa8jkEFDPlxdQ_PeSautByDoTaZXkqTLVz5dBgD40sZObCxfMbmj2C5p4M/exec",
      {
        method: "POST",
        body: JSON.stringify({
          nome,
          email,
          whatsapp,
          area
        })
      }
    );

    const result = await response.json();

    if (result.success) {
      window.location.href =
        "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
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
