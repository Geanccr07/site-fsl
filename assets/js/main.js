const form = document.getElementById("leadForm");
const submitBtn = document.getElementById("submitBtn");
const whatsappInput = document.getElementById("whatsapp");
const feedback = document.getElementById("formFeedback");

function onlyNumbers(value) {
  return value ? value.replace(/\D/g, "") : "";
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
    const ondeNosConheceuInput = document.getElementById("onde_nos_conheceu");
    const momentoProfissionalInput = document.getElementById("momento_profissional");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const whatsappRaw = onlyNumbers(whatsappInput.value); 
    const onde_nos_conheceu = ondeNosConheceuInput.value;
    const momento_profissional = momentoProfissionalInput.value;

    // Validações
    if (!nome) return showError(nomeInput, "Por favor, informe seu nome.");
    if (!email || !email.includes("@")) return showError(emailInput, "Informe um email válido.");
    if (whatsappRaw.length !== 11) return showError(whatsappInput, "Digite um WhatsApp válido com DDD (Ex: 11 98765-4321).");
    if (!onde_nos_conheceu) return showError(ondeNosConheceuInput, "Conte-nos como nos conheceu.");
    if (!momento_profissional) return showError(momentoProfissionalInput, "Selecione seu momento profissional atual.");

    // Trava o botão para evitar cliques duplicados
    submitBtn.disabled = true;
    submitBtn.innerText = "Enviando...";

    try {
      // Dispara o evento de submit no dataLayer antes do redirecionamento
      window.dataLayer.push({
        event: "form_submit",
        form_name: "home-site"
      });

      // Captura parâmetros UTM da URL atual
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get("utm_source") || "";
      const utm_medium = urlParams.get("utm_medium") || "";
      const utm_campaign = urlParams.get("utm_campaign") || "";

      // Captura a URL da página anterior (Referer no payload)
      const referer = document.referrer || "Acesso Direto / Desconhecido";

      const N8N_WEBHOOK_URL = "https://n8n.firststeplab.com.br/webhook/868ba4e8-59ca-4000-9863-0b2c2c47c9e5";

      // Requisição fetch isolada com tratamento simplificado para evitar bloqueios cross-origin de resposta
      await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors", // Garante o envio mesmo que o n8n não devolva os headers CORS de volta
        headers: {
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({ 
          nome, 
          email, 
          whatsapp: whatsappRaw, 
          onde_nos_conheceu,
          momento_profissional, 
          utm_source,
          utm_medium,
          utm_campaign,
          referer
        })
      });

      // Como usamos 'no-cors' para garantir a entrega sem travas no navegador, seguimos direto para o sucesso
      showSuccess("Tudo certo! Redirecionando...");
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 1500);

    } catch (error) {
      console.error("Erro no envio do formulário:", error);
      // Fallback de segurança para o usuário não ficar travado caso a rede caia completamente
      showSuccess("Redirecionando para a comunidade...");
      setTimeout(() => {
        window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 2000);
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
      track.scrollLeft += getScrollAmount();
    });

    btnPrev.addEventListener("click", () => {
      track.scrollLeft -= getScrollAmount();
    });

    track.addEventListener("mousedown", () => { track.style.scrollBehavior = "auto"; });
    track.addEventListener("mouseup", () => { track.style.scrollBehavior = "smooth"; });
  }
});

/* =====================
   HEADER: ESTADO AO ROLAR
===================== */
const siteHeader = document.querySelector("header");
if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });
}

/* =====================
   SCROLL-REVEAL (fade/slide ao entrar na tela)
===================== */
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -60px 0px" });

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
}

/* =====================
   MICRO CONVERSÕES FORM (Ajustado)
===================== */
window.dataLayer = window.dataLayer || [];

let formStarted = false;
const completedSteps = new Set();

const steps = [
  { id: "nome", name: "nome", number: 1 },
  { id: "email", name: "email", number: 2 },
  { id: "whatsapp", name: "whatsapp", number: 3 },
  { id: "onde_nos_conheceu", name: "origem", number: 4 },
  { id: "momento_profissional", name: "momento_profissional", number: 5 } 
];

steps.forEach(step => {
  const field = document.getElementById(step.id);
  if (!field) return;

  const triggerFormStart = () => {
    if (!formStarted) {
      formStarted = true;
      window.dataLayer.push({
        event: "form_start",
        form_name: "home-site"
      });
    }
  };

  field.addEventListener("input", (e) => {
    if (e.target.value && e.target.value.toString().trim() !== "") {
      triggerFormStart();
    }
  });

  field.addEventListener("change", (e) => {
    if (!e.target.value) return;
    const value = e.target.value.toString().trim();

    if (value !== "") {
      triggerFormStart();
    }

    if (value !== "" && !completedSteps.has(step.id)) {
      completedSteps.add(step.id);
      
      window.dataLayer.push({
        event: "form_step",
        step: step.name,
        step_number: step.number
      });
    }
  });
});