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
   FORMULÁRIO: QUERO SER MENTOR
===================== */
const mentorForm = document.getElementById("mentorForm");
const mentorSubmitBtn = document.getElementById("mentorSubmitBtn");
const mentorWhatsappInput = document.getElementById("mentorWhatsapp");
const mentorFeedback = document.getElementById("mentorFormFeedback");

function mentorClearErrors() {
  if (!mentorFeedback) return;
  mentorFeedback.style.display = "none";
  mentorFeedback.className = "form-feedback";
  if (mentorForm) {
    mentorForm.querySelectorAll(".field-error").forEach(el => {
      el.classList.remove("field-error");
    });
  }
}

function mentorShowError(input, message) {
  if (!mentorFeedback) return;

  if (input) {
    const label = input.closest("label");
    if (label) {
      label.classList.add("field-error");
    }
  }

  mentorFeedback.innerText = message;
  mentorFeedback.className = "form-feedback error";
  mentorFeedback.style.display = "block";
  mentorFeedback.scrollIntoView({ behavior: "smooth", block: "center" });
}

function mentorShowSuccess(message) {
  if (!mentorFeedback) return;
  mentorFeedback.innerText = message;
  mentorFeedback.className = "form-feedback success";
  mentorFeedback.style.display = "block";
}

if (mentorWhatsappInput) {
  mentorWhatsappInput.addEventListener("input", (e) => {
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

if (mentorForm) {
  mentorForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    mentorClearErrors();

    const nomeInput = document.getElementById("mentorNome");
    const linkedinInput = document.getElementById("mentorLinkedin");
    const mensagemInput = document.getElementById("mentorMensagem");

    const nome = nomeInput.value.trim();
    const whatsappRaw = onlyNumbers(mentorWhatsappInput.value);
    const linkedin = linkedinInput.value.trim();
    const mensagem = mensagemInput.value.trim();

    if (!nome) return mentorShowError(nomeInput, "Por favor, informe seu nome.");
    if (whatsappRaw.length !== 11) return mentorShowError(mentorWhatsappInput, "Digite um WhatsApp válido com DDD (Ex: 11 98765-4321).");
    if (!linkedin) return mentorShowError(linkedinInput, "Cole o link do seu LinkedIn.");
    if (!mensagem) return mentorShowError(mensagemInput, "Conte pra gente por que você quer ser mentor.");

    mentorSubmitBtn.disabled = true;
    mentorSubmitBtn.innerText = "Enviando...";

    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "form_submit",
        form_name: "seja-mentor"
      });

      const MENTOR_WEBHOOK_URL = "https://n8n.firststeplab.com.br/webhook/856e69f1-185e-42db-ac8a-3aa9ef13e21bsfafasf5355-sdasfsa53543";

      await fetch(MENTOR_WEBHOOK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          whatsapp: whatsappRaw,
          linkedin,
          mensagem
        })
      });

      mentorShowSuccess("Recebemos seu interesse! Nosso time vai te chamar em breve.");
      mentorForm.reset();

    } catch (error) {
      console.error("Erro no envio do formulário de mentor:", error);
      mentorShowSuccess("Recebemos seu interesse! Nosso time vai te chamar em breve.");
      mentorForm.reset();
    } finally {
      mentorSubmitBtn.disabled = false;
      mentorSubmitBtn.innerText = "Enviar inscrição";
    }
  });
}

/* =====================
   CARROSSÉIS (setas + arrastar com mouse/touch)
===================== */
function initDragCarousel(trackId, prevBtnId, nextBtnId, itemSelector, options) {
  const track = document.getElementById(trackId);
  const btnPrev = document.getElementById(prevBtnId);
  const btnNext = document.getElementById(nextBtnId);
  if (!track) return;

  const highlightActive = !!(options && options.highlightActive);

  const getScrollAmount = () => {
    const item = track.querySelector(itemSelector);
    const gap = parseFloat(getComputedStyle(track).gap) || 24;
    return item ? item.offsetWidth + gap : 300;
  };

  if (btnNext) btnNext.addEventListener("click", () => { track.scrollLeft += getScrollAmount(); });
  if (btnPrev) btnPrev.addEventListener("click", () => { track.scrollLeft -= getScrollAmount(); });

  let isDown = false;
  let dragged = false;
  let startX = 0;
  let startScroll = 0;

  const dragStart = (x) => {
    isDown = true;
    dragged = false;
    startX = x;
    startScroll = track.scrollLeft;
    track.classList.add("is-dragging");
  };

  const dragMove = (x, event) => {
    if (!isDown) return;
    const delta = x - startX;
    if (Math.abs(delta) > 5) dragged = true;
    track.scrollLeft = startScroll - delta;
    if (event) event.preventDefault();
  };

  const dragEnd = () => {
    isDown = false;
    track.classList.remove("is-dragging");
  };

  track.addEventListener("mousedown", (e) => dragStart(e.pageX));
  track.addEventListener("mousemove", (e) => dragMove(e.pageX, e));
  window.addEventListener("mouseup", dragEnd);
  track.addEventListener("mouseleave", dragEnd);

  track.addEventListener("touchstart", (e) => dragStart(e.touches[0].pageX), { passive: true });
  track.addEventListener("touchmove", (e) => dragMove(e.touches[0].pageX), { passive: true });
  track.addEventListener("touchend", dragEnd);

  // Evita que o clique em cards/links do carrossel dispare logo depois de um arraste
  track.addEventListener("click", (e) => {
    if (dragged) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  // Destaca o card mais próximo do centro da trilha enquanto arrasta/rola (efeito de "foco")
  if (highlightActive) {
    let ticking = false;

    const updateActiveCard = () => {
      ticking = false;
      const items = track.querySelectorAll(itemSelector);
      const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;

      let closest = null;
      let closestDistance = Infinity;

      items.forEach((item) => {
        const box = item.getBoundingClientRect();
        const itemCenter = box.left + box.width / 2;
        const distance = Math.abs(itemCenter - trackCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = item;
        }
        item.classList.remove("is-active");
      });

      if (closest) closest.classList.add("is-active");
    };

    track.addEventListener("scroll", () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateActiveCard);
      }
    }, { passive: true });

    updateActiveCard();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  initDragCarousel("testimonialTrack", "prevBtn", "nextBtn", ".testimonial");
  initDragCarousel("resourcesTrack", "resourcesPrevBtn", "resourcesNextBtn", ".resource-card", { highlightActive: true });
});

/* =====================
   HEADER: SOMBRA AO ROLAR (fundo em vidro já é fixo via CSS)
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
   DESTAQUE DE TEXTO NO SCROLL (narrativa da página Sobre)
===================== */
const scrollHighlightEls = document.querySelectorAll(".scroll-highlight");
if (scrollHighlightEls.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const highlightWords = [];

  scrollHighlightEls.forEach((el) => {
    const text = el.textContent;
    el.innerHTML = text
      .split(/(\s+)/)
      .map((chunk) => (chunk.trim() ? `<span class="word word-dim">${chunk}</span>` : chunk))
      .join("");
    highlightWords.push(...el.querySelectorAll(".word"));
  });

  let highlightTicking = false;
  const updateScrollHighlight = () => {
    const triggerLine = window.innerHeight * 0.72;
    highlightWords.forEach((word) => {
      word.classList.toggle("word-dim", word.getBoundingClientRect().top > triggerLine);
    });
    highlightTicking = false;
  };

  updateScrollHighlight();
  window.addEventListener("load", updateScrollHighlight);
  window.addEventListener("scroll", () => {
    if (!highlightTicking) {
      requestAnimationFrame(updateScrollHighlight);
      highlightTicking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateScrollHighlight);
}

/* =====================
   CONTADOR DE NÚMEROS (stats da página Sobre)
===================== */
const countEls = document.querySelectorAll("[data-count-target]");
if (countEls.length) {
  const animateCount = (el) => {
    const target = parseInt(el.getAttribute("data-count-target"), 10) || 0;
    const duration = 900;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = "+" + Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    countEls.forEach((el) => countObserver.observe(el));
  } else {
    countEls.forEach((el) => {
      el.textContent = "+" + el.getAttribute("data-count-target");
    });
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