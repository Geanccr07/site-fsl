document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("leadForm");
    const whatsappInput = document.getElementById("whatsapp");
    const feedback = document.getElementById("formFeedback");
    const submitBtn = document.getElementById("submitBtn");

    if (!form) return;

    /* Mascara e Limpeza */
    const onlyNumbers = (val) => val.replace(/\D/g, "");
    
    const formatWhatsApp = (val) => {
        const nums = onlyNumbers(val);
        if (nums.length <= 2) return `(${nums}`;
        if (nums.length <= 7) return `(${nums.slice(0, 2)})${nums.slice(2)}`;
        if (nums.length <= 11) return `(${nums.slice(0, 2)})${nums.slice(2, 7)}-${nums.slice(7)}`;
        return val;
    };

    whatsappInput.addEventListener("input", (e) => {
        e.target.value = formatWhatsApp(e.target.value);
    });

    /* Envio */
    form.addEventListener("submit", async (e) => {
        e.preventDefault(); // Impede o recarregamento
        
        // Reset de Feedback
        feedback.style.display = "none";
        feedback.className = "form-feedback";

        const whatsappRaw = onlyNumbers(whatsappInput.value);
        const payload = {
            nome: document.getElementById("nome").value.trim(),
            email: document.getElementById("email").value.trim(),
            whatsapp: whatsappRaw,
            area: document.getElementById("area").value,
            como_nos_conheceu: document.getElementById("onde_nos_conheceu").value
        };

        // Validação: Todos campos preenchidos + WhatsApp com exatamente 11 números
        if (!payload.nome || !payload.email || !payload.area || !payload.como_nos_conheceu || whatsappRaw.length !== 11) {
            feedback.innerText = "Preencha todos os campos corretamente (WhatsApp deve ter 11 dígitos).";
            feedback.className = "form-feedback error";
            feedback.style.display = "block";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Enviando...";

        try {
            const response = await fetch("https://script.google.com/macros/s/AKfycbwoVtEbUFC0dtyQYIMfejUvFC-HzJBttm6a2_lbCK71_HsSkJX6vyc_FnHlqn-OFdkw/exec", {
                method: "POST",
                mode: "cors", // Ativa o modo CORS explicitamente
                headers: {
                    "Content-Type": "text/plain;charset=utf-8", // Mantido text/plain para evitar o Pre-flight do Google que causa erro 405
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (result.success) {
                feedback.innerText = "Tudo certo! Redirecionando...";
                feedback.className = "form-feedback success";
                feedback.style.display = "block";
                
                setTimeout(() => {
                    window.location.href = "https://chat.whatsapp.com/CCrYGei0DDrGRHfI1Jdsta";
                }, 1500);
            } else {
                throw new Error(result.error);
            }

        } catch (error) {
            console.error("Erro:", error);
            feedback.innerText = "Erro ao enviar. Tente novamente.";
            feedback.className = "form-feedback error";
            feedback.style.display = "block";
            submitBtn.disabled = false;
            submitBtn.innerText = "Acessar comunidade";
        }
    });
});

/* Carrossel (Simplificado para não quebrar) */
document.addEventListener("DOMContentLoaded", () => {
    const track = document.getElementById("testimonialTrack");
    const btnPrev = document.getElementById("prevBtn");
    const btnNext = document.getElementById("nextBtn");
    if (track && btnPrev && btnNext) {
        const scroll = () => track.querySelector(".testimonial").offsetWidth + 24;
        btnNext.onclick = () => track.scrollBy({ left: scroll(), behavior: "smooth" });
        btnPrev.onclick = () => track.scrollBy({ left: -scroll(), behavior: "smooth" });
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
