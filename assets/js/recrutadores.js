(function () {
  const secao = document.getElementById("telas");
  if (!secao) return;

  const opcoes = Array.from(secao.querySelectorAll(".telas-opcao"));
  const legenda = secao.querySelector(".telas-legenda-mobile");
  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const INTERVALO = 7000;
  let atual = 0;
  let timer = null;
  let parado = reduzir;

  const mostrar = (indice, focar) => {
    atual = indice;
    opcoes.forEach((opcao, i) => {
      const ativa = i === indice;
      opcao.setAttribute("aria-selected", String(ativa));
      opcao.tabIndex = ativa ? 0 : -1;
      const tela = document.getElementById(opcao.getAttribute("aria-controls"));
      tela.classList.toggle("ativa", ativa);
      tela.setAttribute("aria-hidden", String(!ativa));
      const barra = opcao.querySelector(".telas-barra i");
      barra.classList.remove("corre");
      if (ativa && !parado) {
        void barra.offsetWidth;
        barra.classList.add("corre");
      }
    });
    legenda.textContent = opcoes[indice].querySelector(".telas-texto").textContent;
    if (focar) opcoes[indice].focus();
    agendar();
  };

  const agendar = () => {
    clearTimeout(timer);
    if (!parado) timer = setTimeout(() => mostrar((atual + 1) % opcoes.length), INTERVALO);
  };

  const parar = () => {
    parado = true;
    clearTimeout(timer);
    secao.querySelectorAll(".telas-barra i").forEach((b) => b.classList.remove("corre"));
  };

  opcoes.forEach((opcao, i) => {
    opcao.addEventListener("click", () => {
      parar();
      mostrar(i);
    });
    opcao.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault();
      parar();
      const passo = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
      mostrar((atual + passo + opcoes.length) % opcoes.length, true);
    });
  });

  if ("IntersectionObserver" in window && !parado) {
    let iniciou = false;
    new IntersectionObserver((entradas, obs) => {
      if (entradas.some((e) => e.isIntersecting) && !iniciou) {
        iniciou = true;
        obs.disconnect();
        mostrar(atual);
      }
    }, { threshold: 0.3 }).observe(secao);
  } else {
    mostrar(atual);
  }
})();
