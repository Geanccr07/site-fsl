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
   MÁSCARA WHATSAPP (Front-end)
===================== */
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

/* =====================
   SUBMIT
===================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const areaInput = document.getElementById("area");
  const ondeNosConheceuInput = document.getElementById("onde_nos_conheceu"); // Novo campo

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const whatsappRaw = onlyNumbers(whatsappInput.value); // Pega apenas os números para o envio
  const area = areaInput.value;
  const onde_nos_conheceu = ondeNosConheceuInput.value; // Novo campo

  // Validações
  if (!nome) {
    showError(nomeInput, "Por favor, informe seu nome.");
    return;
  }

  if (!email || !email.includes("@")) {
    showError(emailInput, "Informe um email válido.");
    return;
  }

  // Validação do tamanho do número (DDD + 9 dígitos)
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
          whatsapp: whatsappRaw, // Envia apenas números para facilitar o tratamento no Sheet
          area, 
          onde_nos_conheceu // Campo incluído no payload
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
