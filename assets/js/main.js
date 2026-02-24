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

function showError(message) {
  feedback.innerText = message;
  feedback.classList.add("error");
  feedback.style.display = "block";
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
  e.preventDefault(); // GARANTE QUE NÃO VAI FAZER GET
  clearErrors();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const area = document.getElementById("area").value;
  const como_nos_conheceu = document.getElementById("onde_nos_conheceu").value;
  const whatsappRaw = onlyNumbers(whatsappInput.value);

  if (!nome || !email || !area || !como_nos_conheceu || whatsappRaw.length !== 11) {
    showError("Preencha todos os campos corretamente.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.innerText = "Enviando...";

  try {

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbxy8B07wMNIKIz4r_zb1rPdCHtdrfAOp8Chy53WDbgJLNWRVxBEM8RAJGyrt7Bv4R-V/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome,
          email,
          whatsapp: whatsappRaw,
          area,
          como_nos_conheceu
        })
      }
    );

    const result = await response.json();

    if (result.success) {
      showSuccess("Tudo certo! Redirecionando...");

      setTimeout(() => {
        window.location.href =
          "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
      }, 1500);

    } else {
      throw new Error(result.error || "Erro no servidor");
    }

  } catch (error) {
    console.error(error);
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
