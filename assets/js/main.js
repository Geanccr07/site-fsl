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

function formatWhatsApp(value) {
  const numbers = onlyNumbers(value);

  if (numbers.length <= 2)
    return `(${numbers}`;
  if (numbers.length <= 7)
    return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
  if (numbers.length <= 11)
    return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;

  return value;
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
  if (label) label.classList.add("field-error");

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
  whatsappInput.value = formatWhatsApp(whatsappInput.value);
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
  const ondeInput = document.getElementById("onde_nos_conheceu");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const whatsappRaw = onlyNumbers(whatsappInput.value);
  const area = areaInput.value;
  const onde_nos_conheceu = ondeInput.value;

  if (!nome) {
    showError(nomeInput, "Por favor, informe seu nome.");
    return;
  }

  if (!email || !email.includes("@")) {
    showError(emailInput, "Informe um email válido.");
    return;
  }

  if (whatsappRaw.length !== 11) {
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

  if (!onde_nos_conheceu) {
    showError(ondeInput, "Selecione como nos conheceu.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  try {
        const response = await fetch(
  "https://script.google.com/macros/s/AKfycbyVhoIXnvVbANWGcGmeL-Dko5YjvVr8_lJzetVlJOZvHrMV81CgdKiTrkfiJnDroN60/exec",
  {
    method: "POST",
    body: JSON.stringify({
      nome,
      email,
      whatsapp: whatsappRaw,
      area,
      onde_nos_conheceu
    })
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
    showError(form, "Erro de conexão. Tente novamente.");
    submitBtn.disabled = false;
    submitBtn.innerText = "Acessar comunidade";
  }
});
/* =====================
   CARROSSEL DEPOIMENTOS
===================== */
document.addEventListener("DOMContentLoaded", () => {
  // Alterado para buscar o novo container e os IDs específicos
  const track = document.getElementById("testimonialTrack");
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");

  // Verificamos se todos os elementos existem na página antes de rodar
  if (track && btnPrev && btnNext) {
    
    // Função para calcular o quanto o carrossel deve andar
    const getScrollAmount = () => {
      const item = track.querySelector(".testimonial");
      // Retorna a largura do card + o espaçamento (gap) de 24px
      return item ? item.offsetWidth + 24 : 300;
    };

    // Evento do botão "Próximo"
    btnNext.addEventListener("click", () => {
      track.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth"
      });
    });

    // Evento do botão "Anterior"
    btnPrev.addEventListener("click", () => {
      track.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
      });
    });

    // Opcional: Pausar o scroll suave se o usuário arrastar manualmente (melhora a experiência)
    track.addEventListener("mousedown", () => {
      track.style.scrollBehavior = "auto";
    });
    
    track.addEventListener("mouseup", () => {
      track.style.scrollBehavior = "smooth";
    });
  }
});
