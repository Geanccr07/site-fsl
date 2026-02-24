/* =====================
   FUNÇÕES DE UTILIDADE
===================== */
function onlyNumbers(value) {
    return value ? value.replace(/\D/g, "") : "";
}

function formatWhatsApp(value) {
    const numbers = onlyNumbers(value);
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)})${numbers.slice(2)}`;
    if (numbers.length <= 11) return `(${numbers.slice(0, 2)})${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    return value;
}

// Inicialização garantida após o carregamento do DOM
document.addEventListener("DOMContentLoaded", () => {
    
    /* =====================
       LÓGICA DO FORMULÁRIO
    ===================== */
    const form = document.getElementById("leadForm");
    const whatsappInput = document.getElementById("whatsapp");
    const feedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");

    // Só executa se o formulário existir na página atual
    if (form) {
        
        // Máscara do WhatsApp
        if (whatsappInput) {
            whatsappInput.addEventListener("input", (e) => {
                e.target.value = formatWhatsApp(e.target.value);
            });
        }

        form.addEventListener("submit", async (e) => {
            e.preventDefault(); // MATA o recarregamento aqui
            e.stopPropagation();

            // Limpa estados anteriores
            feedback.style.display = "none";
            feedback.className = "form-feedback";

            const nome = document.getElementById("nome").value.trim();
            const email = document.getElementById("email").value.trim();
            const area = document.getElementById("area").value;
            const onde_conheceu = document.getElementById("onde_nos_conheceu").value;
            const whatsappRaw = onlyNumbers(whatsappInput.value);

            // Validação Manual Robusta
            if (!nome || !email || !area || !onde_conheceu || whatsappRaw.length < 10) {
                feedback.innerText = "Preencha todos os campos corretamente.";
                feedback.classList.add("error");
                feedback.style.display = "block";
                return;
            }

            // Estado de carregamento
            submitBtn.disabled = true;
            submitBtn.innerText = "Enviando...";

            const payload = {
                nome: nome,
                email: email,
                whatsapp: whatsappRaw,
                area: area,
                como_nos_conheceu: onde_conheceu
            };

            try {
                // Usamos no-cors para evitar o bloqueio do Google Apps Script
                await fetch(form.action || "https://script.google.com/macros/s/AKfycbwoVtEbUFC0dtyQYIMfejUvFC-HzJBttm6a2_lbCK71_HsSkJX6vyc_FnHlqn-OFdkw/exec", {
                    method: "POST",
                    mode: "no-cors",
                    headers: { "Content-Type": "text/plain;charset=utf-8" },
                    body: JSON.stringify(payload)
                });

                // Como o 'no-cors' não permite ler a resposta, tratamos como sucesso após o envio
                feedback.innerText = "Tudo certo! Redirecionando...";
                feedback.classList.add("success");
                feedback.style.display = "block";

                setTimeout(() => {
                    window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
                }, 1500);

            } catch (error) {
                console.error("Erro no envio:", error);
                feedback.innerText = "Erro ao enviar. Tente novamente.";
                feedback.classList.add("error");
                feedback.style.display = "block";
                submitBtn.disabled = false;
                submitBtn.innerText = "Acessar comunidade";
            }
        });
    }


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
