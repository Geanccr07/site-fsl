(function () {
  const nav = document.querySelector("header nav");
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll("a:not(.header-logo)"));
  if (!links.length) return;

  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "menu-toggle";
  botao.setAttribute("aria-expanded", "false");
  botao.setAttribute("aria-controls", "menuLateral");
  botao.innerHTML = 'Menu <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
  nav.appendChild(botao);

  const veu = document.createElement("div");
  veu.className = "menu-veu";

  const painel = document.createElement("aside");
  painel.className = "menu-lateral";
  painel.id = "menuLateral";
  painel.setAttribute("aria-label", "Menu");
  painel.setAttribute("aria-hidden", "true");
  painel.inert = true;

  const fechar = document.createElement("button");
  fechar.type = "button";
  fechar.className = "menu-fechar";
  fechar.setAttribute("aria-label", "Fechar menu");
  fechar.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  const lista = document.createElement("nav");
  lista.setAttribute("aria-label", "Principal");
  links.forEach((a) => lista.appendChild(a.cloneNode(true)));

  painel.append(fechar, lista);
  document.body.append(veu, painel);
  document.documentElement.classList.add("tem-menu-lateral");

  const definir = (aberto) => {
    document.body.classList.toggle("menu-aberto", aberto);
    botao.setAttribute("aria-expanded", String(aberto));
    painel.setAttribute("aria-hidden", String(!aberto));
    painel.inert = !aberto;
    (aberto ? fechar : botao).focus();
  };

  botao.addEventListener("click", () => definir(true));
  fechar.addEventListener("click", () => definir(false));
  veu.addEventListener("click", () => definir(false));
  lista.addEventListener("click", (e) => {
    if (e.target.closest("a")) definir(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-aberto")) definir(false);
  });
})();
