const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");
const feedback = document.getElementById("formFeedback");

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function clearErrors() {
  feedback.style.display = "none";
  feedback.className = "form-feedback";
  if (form) {
    form.querySelectorAll(".field-error").forEach(el => {
      el.classList.remove("field-error");
    });
  }
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
   MÁSCARA WHATSAPP (Front-end)
===================== */
if (whatsappInput) {
  whatsappInput.addEventListener("input", (e) => {
    let value = onlyNumbers(e.target.value);
    
    // Limita a 11 dígitos
    if (value.length > 11) value = value.slice(0, 11);

    // Aplica a formatação (XX) XXXXX-XXXX
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, "($1) $2-$3");
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, "($1");
    }
    
    e.target.value = value;
  });
}

/* =====================
   SUBMIT
===================== */
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const areaInput = document.getElementById("area");
    const ondeNosConheceuInput = document.getElementById("onde_nos_conheceu");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const whatsappRaw = onlyNumbers(whatsappInput.value); 
    const area = areaInput.value;
    const onde_nos_conheceu = ondeNosConheceuInput.value;

    // Validações
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
        "Digite um WhatsApp válido com DDD (Ex: 11 98765-4321)."
      );
      return;
    }

    if (!area) {
      showError(areaInput, "Selecione sua área de estudo.");
      return;
    }

    if (!onde_nos_conheceu) {
      showError(ondeNosConheceuInput, "Conte-nos como nos conheceu.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Enviando...";

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwP_3y9rBsCmVW68iLwepOMIFX-Kli4y8djnKCN73OZ8uijuwUIcNwKGd8U10zL7BBU/exec",
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
        showSuccess("Tudo certo! Redirecionando...");
        setTimeout(() => {
          window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
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
}

/* =====================
   CARROSSEL DEPOIMENTOS
===================== */
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("testimonialTrack");
  const btnPrev = document.getElementById("prevBtn");
  const btnNext = document.getElementById("nextBtn");

  if (track && btnPrev && btnNext) {
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

    track.addEventListener("mousedown", () => {
      track.style.scrollBehavior = "auto";
    });
    
    track.addEventListener("mouseup", () => {
      track.style.scrollBehavior = "smooth";
    });
  }
});

/* =====================
   MICRO CONVERSÕES FORM
===================== */

// Garante o escopo global do dataLayer logo no início do bloco
window.dataLayer = window.dataLayer || [];

let formStarted = false;
const completedSteps = new Set();

const steps = [
  { id: "nome", name: "nome", number: 1 },
  { id: "email", name: "email", number: 2 },
  { id: "whatsapp", name: "whatsapp", number: 3 },
  { id: "area", name: "area_estudo", number: 4 },
  { id: "onde_nos_conheceu", name: "origem", number: 5 }
];

steps.forEach(step => {
  const field = document.getElementById(step.id);

  if (!field) return;

  // 1. FORM_START: Dispara no primeiro caractere digitado ou opção selecionada
  field.addEventListener("input", () => {
    if (!formStarted) {
      formStarted = true;
      window.dataLayer.push({
        event: "form_start",
        form_name: "home-site"
      });
    }
  });

  // 2. FORM_STEP: Dispara ao alterar o campo e sair dele (ir para o próximo)
  field.addEventListener("change", (e) => {
    // Só dispara se o campo não estiver vazio e ainda não tiver sido disparado
    if (e.target.value.trim() !== "" && !completedSteps.has(step.id)) {
      completedSteps.add(step.id);

      window.dataLayer.push({
        event: "form_step",
        step: step.name,
        step_number: step.number
      });
    }
  });
});
