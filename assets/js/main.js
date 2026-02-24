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
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  return value;
}

function clearErrors() {
  feedback.style.display = "none";
  feedback.className = "form-feedback";
  form.querySelectorAll(".field-error").forEach(el => el.classList.remove("field-error"));
}

function showError(message) {
  feedback.innerText = message;
  feedback.className = "form-feedback error";
  feedback.style.display = "block";
}

function showSuccess(message) {
  feedback.innerText = message;
  feedback.className = "form-feedback success";
  feedback.style.display = "block";
}

/* =====================
   INPUT WHATSAPP
===================== */
if (whatsappInput) {
  whatsappInput.addEventListener("input", () => {
    whatsappInput.value = formatWhatsApp(whatsappInput.value);
  });
}

/* =====================
   SUBMIT (CORRIGIDO)
===================== */
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede o recarregamento da página
  clearErrors();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const area = document.getElementById("area").value;
  const como_nos_conheceu = document.getElementById("onde_nos_conheceu").value;
  const whatsappRaw = onlyNumbers(whatsappInput.value);

  // Validação
  if (!nome || !email || !area || !como_nos_conheceu || whatsappRaw.length < 10) {
    showError("Preencha todos os campos corretamente.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  const payload = {
    nome,
    email,
    whatsapp: whatsappRaw,
    area,
    como_nos_conheceu
  };

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwoVtEbUFC0dtyQYIMfejUvFC-HzJBttm6a2_lbCK71_HsSkJX6vyc_FnHlqn-OFdkw/exec",
      {
        method: "POST",
        mode: "no-cors", // Crucial para Google Apps Script evitar pre-flight
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(payload)
      }
    );

    // Como usamos 'no-cors', não conseguimos ler a resposta JSON. 
    // Assumimos sucesso se não cair no catch após o envio.
    showSuccess("Tudo certo! Redirecionando...");
    
    setTimeout(() => {
      window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
    }, 2000);

  } catch (error) {
    console.error("Erro na requisição:", error);
    showError("Erro ao enviar. Tente novamente.");
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
