(function () {
  const palco = document.getElementById("recursosRoda");
  if (!palco) return;

  const itens = Array.from(palco.querySelectorAll(".recursos-itens li"));
  if (!itens.length) return;

  const DURACAO = 4500;
  const reduz = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let atual = 0;
  let decorrido = 0;
  let pausado = false;
  let visivel = false;
  const timersSaida = new Map();

  const mostrar = (n) => {
    const antes = atual;
    atual = (n + itens.length) % itens.length;
    decorrido = 0;
    if (antes !== atual) {
      const sai = itens[antes];
      sai.classList.add("saindo");
      clearTimeout(timersSaida.get(sai));
      timersSaida.set(sai, setTimeout(() => sai.classList.remove("saindo"), 450));
    }
    itens.forEach((li, i) => {
      li.classList.toggle("ativo", i === atual);
      if (i === atual) li.classList.remove("saindo");
    });
  };

  palco.classList.add("pronto");
  mostrar(0);

  const secao = palco.closest(".recursos") || palco;
  palco.addEventListener("pointerenter", (e) => { if (e.pointerType === "mouse") pausado = true; });
  palco.addEventListener("pointerleave", () => { pausado = false; });

  if (reduz) return;

  new IntersectionObserver((entradas) => {
    visivel = entradas[0].isIntersecting;
  }, { threshold: 0.4 }).observe(secao);

  let anterior = performance.now();
  const passo = (agora) => {
    if (!pausado && visivel && !document.hidden) {
      decorrido += agora - anterior;
      if (decorrido >= DURACAO) mostrar(atual + 1);
    }
    anterior = agora;
    requestAnimationFrame(passo);
  };
  requestAnimationFrame(passo);
})();
