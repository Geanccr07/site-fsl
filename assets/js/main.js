const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");
const feedback = document.getElementById("formFeedback");

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function clearErrors() {
  if (!feedback) return;
  feedback.style.display = "none";
  feedback.className = "form-feedback";
  if (form) {
    form.querySelectorAll(".field-error").forEach(el => {
      el.classList.remove("field-error");
    });
  }
}

function showError(input, message) {
  if (!feedback) return;
  
  // Só tenta aplicar a classe de erro se o elemento estiver dentro de um label
  if (input) {
    const label = input.closest("label");
    if (label) {
      label.classList.add("field-error");
    }
  }
  
  feedback.innerText = message;
  feedback.className = "form-feedback error";
  feedback.style.display = "block";
  feedback.scrollIntoView({ behavior: "smooth", block: "center" });
}

function showSuccess(message) {
  if (!feedback) return;
  feedback.innerText = message;
  feedback.className = "form-feedback success";
  feedback.style.display = "block";
}

/* =====================
   MÁSCARA WHATSAPP (Front-end)
===================== */
if (whatsappInput) {
  whatsappInput.addEventListener("input", (e) => {
    let value = onlyNumbers(e.target.value);
    
    if (value.length > 11) value = value.slice(0, 11);

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
   SUBMIT E REDIRECIONAMENTO
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
    if (!nome) return showError(nomeInput, "Por favor, informe seu nome.");
    if (!email || !email.includes("@")) return showError(emailInput, "Informe um email válido.");
    if (whatsappRaw.length !== 11) return showError(whatsappInput, "Digite um WhatsApp válido com DDD (Ex: 11 98765-4321).");
    if (!area) return showError(areaInput, "Selecione sua área de estudo.");
    if (!onde_nos_conheceu) return showError(ondeNosConheceuInput, "Conte-nos como nos conheceu.");

    // Trava o botão para evitar cliques duplicados
    submitBtn.disabled = true;
    submitBtn.innerText = "Enviando...";

    try {
      // Dispara o evento de submit no dataLayer antes do redirecionamento
      window.dataLayer.push({
        event: "form_submit",
        form_name: "home-site"
      });

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbwP_3y9rBsCmVW68iLwepOMIFX-Kli4y8djnKCN73OZ8uijuwUIcNwKGd8U10zL7BBU/exec",
        {
          method: "POST",
          mode: "cors", // Garante requisição cross-origin explícita
          headers: {
            "Content-Type": "text/plain;charset=utf-8" // Evita o bloqueio de preflight do Google Apps Script
          },
          body: JSON.stringify({ 
            nome, 
            email, 
            whatsapp: whatsappRaw, 
            area, 
            onde_nos_conheceu 
          })
        }
      );

      // Se a resposta voltou vazia ou bloqueada pelo CORS do Google, mas o status for OK (ou 0 em no-cors)
      // Forçamos o sucesso pois o dado costuma entrar na planilha mesmo com o bloqueio de leitura do browser
      showSuccess("Tudo certo! Redirecionando...");
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 1500);

    } catch (error) {
      console.error("Erro no envio:", error);
      showError(null, "Erro de conexão ao salvar os dados. Mas você já pode entrar na comunidade!");
      
      // Fallback de segurança: mesmo se a API cair de fato, o usuário não perde o acesso
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 2500);
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
      track.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
    });

    btnPrev.addEventListener("click", () => {
      track.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
    });

    track.addEventListener("mousedown", () => { track.style.scrollBehavior = "auto"; });
    track.addEventListener("mouseup", () => { track.style.scrollBehavior = "smooth"; });
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

// 1. FORM_START: Escuta estritamente o primeiro caractere digitado no campo Nome
const firstNameField = document.getElementById("nome");
if (firstNameField) {
  firstNameField.addEventListener("input", (e) => {
    if (!formStarted && e.target.value.trim() !== "") {
      formStarted = true;
      window.dataLayer.push({
        event: "form_start",
        form_name: "home-site"
      });
    }
  });
}

// 2. FORM_STEP: Monitora a saída de cada campo (quando o usuário avança)
steps.forEach(step => {
  const field = document.getElementById(step.id);
  if (!field) return;

  // Usamos 'blur' (perder o foco), que funciona perfeitamente para Inputs e Selects ao mudar de campo
  field.addEventListener("blur", (e) => {
    // Só dispara se o campo tiver conteúdo preenchido e se ainda não foi computado
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
