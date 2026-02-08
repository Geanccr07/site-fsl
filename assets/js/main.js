const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");
const feedback = document.getElementById("formFeedback");

/* =====================
   UTIL
===================== */
function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function clearErrors() {
  feedback.style.display = "none";
  feedback.className = "form-feedback";

  form.querySelectorAll(".field-error").forEach(el => {
    el.classList.remove("field-error");
  });
}

function showError(input, message) {
  const label = input.closest("label");
  label.classList.add("field-error");

  feedback.innerText = message;
  feedback.classList.add("error");
  feedback.style.display = "block";

  feedback.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showSuccess(message) {
  feedback.innerText = message;
  feedback.classList.add("success");
  feedback.style.display = "block";
}

/* =====================
   INPUT WHATSAPP
===================== */
whatsappInput.addEventListener("input", () => {
  whatsappInput.value = onlyNumbers(whatsappInput.value);
});

/* =====================
   SUBMIT
===================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const areaInput = document.getElementById("area");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const whatsapp = onlyNumbers(whatsappInput.value);
  const area = areaInput.value;

  if (!nome) {
    showError(nomeInput, "Por favor, informe seu nome.");
    return;
  }

  if (!email || !email.includes("@")) {
    showError(emailInput, "Informe um email válido.");
    return;
  }

  if (whatsapp.length !== 11) {
    showError(
      whatsappInput,
      "Digite um WhatsApp válido com DDD (11 números)."
    );
    return;
  }

  if (!area) {
    showError(areaInput, "Selecione sua área de estudo.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycby6pVcpFOqa8jkEFDPlxdQ_PeSautByDoTaZXkqTLVz5dBgD40sZObCxfMbmj2C5p4M/exec",
      {
        method: "POST",
        body: JSON.stringify({ nome, email, whatsapp, area })
      }
    );

    const result = await response.json();

    if (result.success) {
      showSuccess(
        "Tudo certo! Seus dados foram enviados com sucesso. Redirecionando..."
      );

      setTimeout(() => {
        window.location.href =
          "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 1500);

    } else {
      throw new Error("Erro ao enviar");
    }

  } catch (error) {
    showError(submitBtn, "Erro de conexão. Tente novamente.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Acessar comunidade";
  }
});

/* =====================
   CARROSSEL DEPOIMENTOS
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.querySelector(".testimonial-wrapper");
  
  if (wrapper) {
    const track = wrapper.querySelector(".testimonial-track");
    const btnPrev = wrapper.querySelector(".carousel-btn.prev");
    const btnNext = wrapper.querySelector(".carousel-btn.next");

    if (track && btnPrev && btnNext) {
      // Função para pegar a largura de um card + gap
      const getScrollAmount = () => {
        const item = track.querySelector(".testimonial");
        return item ? item.offsetWidth + 24 : 300;
      };

      btnNext.addEventListener("click", () => {
        track.scrollBy({
          left: getScrollAmount(),
          behavior: "smooth"
        });
      });

      btnPrev.addEventListener("click", () => {
        track.scrollBy({
          left: -getScrollAmount(),
          behavior: "smooth"
        });
      });
    }
  }
});
