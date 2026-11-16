/* Ombra Atelier — logica della demo. Nessun dato lascia il browser. */
(function () {
  "use strict";

  var FREE_SHIP = 250;
  var SHIP_COST = 12;
  var KEY_CART = "ombra-atelier.cart";
  var KEY_WISH = "ombra-atelier.wish";
  var KEY_MOTION = "ombra-atelier.nomotion";
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var root = document.documentElement;
  function motionOff() { return reduceMotion.matches || root.classList.contains("no-motion"); }

  var CATEGORIES = { borse: "Borse", piccola: "Piccola pelletteria", cinture: "Cinture" };

  var PRODUCTS = [
    {
      id: "ottavia", photo: "Cognac", name: "Borsa Ottavia", cat: "borse", price: 590, img: "img/borsa-cognac.webp",
      alt: "Borsa a mano in cuoio color cognac con manico rigido",
      desc: "Borsa a mano strutturata in cuoio conciato al vegetale. Manico rigido, chiusura a patta con calamita nascosta e una tasca interna con zip.",
      specs: [["Materiale", "Cuoio vegetale, 2 mm"], ["Misure", "30 × 22 × 12 cm"], ["Fodera", "Cotone tinto"], ["Fatta a", "Firenze, cucita a mano"]],
      colors: [["Cognac", "#94552a"], ["Testa di moro", "#3d2a1e"], ["Nero", "#1d1a18"]], rank: 1
    },
    {
      id: "nina", photo: "Nero", name: "Tracolla Nina", cat: "borse", price: 340, img: "img/tracolla-nera.webp",
      alt: "Piccola borsa a tracolla in pelle nera",
      desc: "Tracolla piccola che porta telefono, chiavi e portacarte. La cinghia si regola su cinque fori e si può staccare.",
      specs: [["Materiale", "Vitello liscio"], ["Misure", "20 × 15 × 6 cm"], ["Tracolla", "Regolabile, 105-125 cm"], ["Fatta a", "Toscana, cucita a mano"]],
      colors: [["Nero", "#1d1a18"], ["Cognac", "#94552a"], ["Oliva", "#56622f"]], rank: 3
    },
    {
      id: "livia", photo: "Avorio", name: "Tote Livia", cat: "borse", price: 460, img: "img/tote-avorio.webp",
      alt: "Borsa tote color avorio con manici in cuoio naturale",
      desc: "Tote capiente in pelle avorio con manici in cuoio naturale. Entra un computer da 14 pollici; il fondo ha cinque piedini in ottone.",
      specs: [["Materiale", "Vitello e cuoio naturale"], ["Misure", "38 × 30 × 14 cm"], ["Manici", "Altezza 24 cm"], ["Fatta a", "Toscana, cucita a mano"]],
      colors: [["Avorio", "#e9dcc6"], ["Sabbia", "#c9b08c"]], rank: 2
    },
    {
      id: "bruno", photo: "Bordeaux", name: "Portafoglio Bruno", cat: "piccola", price: 260, img: "img/portafoglio-bordeaux.webp",
      alt: "Portafoglio con zip in pelle bordeaux",
      desc: "Portafoglio con zip tutto intorno: otto posti per le carte, due scomparti per le banconote e una tasca per le monete.",
      specs: [["Materiale", "Vitello martellato"], ["Misure", "19 × 10 × 2 cm"], ["Zip", "Metallo dorato"], ["Fatto a", "Toscana, cucito a mano"]],
      colors: [["Bordeaux", "#6b1f2a"], ["Nero", "#1d1a18"], ["Cognac", "#94552a"]], rank: 4
    },
    {
      id: "arno", photo: "Marrone", name: "Cintura Arno", cat: "cinture", price: 210, img: "img/cintura.webp",
      alt: "Cintura in cuoio marrone con fibbia dorata",
      desc: "Cintura in un solo pezzo di cuoio, bordi lucidati a mano e fibbia in ottone. Indica la taglia nelle note: la tagliamo su misura.",
      specs: [["Materiale", "Cuoio vegetale, 4 mm"], ["Altezza", "3,5 cm"], ["Fibbia", "Ottone pieno"], ["Fatta a", "Toscana, cucita a mano"]],
      colors: [["Marrone", "#5e3a22"], ["Nero", "#1d1a18"]], rank: 5
    },
    {
      id: "foglia", photo: "Oliva", name: "Porta carte Foglia", cat: "piccola", price: 180, img: "img/portacarte-oliva.webp",
      alt: "Porta carte in pelle verde oliva",
      desc: "Porta carte sottile con quattro tasche esterne e una centrale. Sta in qualsiasi tasca e si ammorbidisce con l'uso.",
      specs: [["Materiale", "Cuoio vegetale, 1,2 mm"], ["Misure", "10,5 × 7,5 cm"], ["Tasche", "5"], ["Fatto a", "Toscana, cucito a mano"]],
      colors: [["Oliva", "#56622f"], ["Cognac", "#94552a"], ["Avorio", "#e9dcc6"]], rank: 6
    }
  ];
  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });

  /* ---------- Utilità ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var fmt = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: 0, maximumFractionDigits: 0 });
  function euro(n) { return fmt.format(n); }

  function load(key) {
    try {
      var raw = window.localStorage.getItem(key);
      var v = raw ? JSON.parse(raw) : [];
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }
  function save(key, value) {
    try { window.localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage non disponibile: la demo funziona lo stesso */ }
  }

  function markMissing(img) {
    function check() { if (img.complete && img.naturalWidth === 0) img.classList.add("is-missing"); }
    img.addEventListener("error", function () { img.classList.add("is-missing"); });
    img.addEventListener("load", function () { img.classList.remove("is-missing"); });
    check();
  }

  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else if (k === "className") n.className = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function heartSvg() {
    var ns = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    var path = document.createElementNS(ns, "path");
    path.setAttribute("d", "M12 20.5s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.7-7.5 10.3-7.5 10.3z");
    svg.appendChild(path);
    return svg;
  }

  function replay(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth;
    node.classList.add(cls);
  }

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    // come popover resta sopra anche alle finestre aperte
    if (typeof t.showPopover === "function") {
      try { if (t.matches(":popover-open")) t.hidePopover(); t.showPopover(); } catch (e) { /* ignora */ }
    }
    t.classList.remove("is-shown");
    void t.offsetWidth;
    t.classList.add("is-shown");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      t.classList.remove("is-shown");
      setTimeout(function () {
        if (!t.classList.contains("is-shown") && typeof t.hidePopover === "function") {
          try { t.hidePopover(); } catch (e) { /* ignora */ }
        }
      }, 450);
    }, 2400);
  }

  /* ---------- Stato ---------- */
  var cart = load(KEY_CART).filter(function (l) { return l && byId[l.id] && l.qty > 0; });
  var wish = load(KEY_WISH).filter(function (id) { return byId[id]; });

  /* ---------- Dialog (finestre e pannelli) ---------- */
  var openStack = [];
  function openDialog(d) {
    if (d.open) return;
    d.classList.remove("is-closing");
    d.showModal();
    openStack.push(d);
    document.documentElement.classList.add("is-locked");
  }
  function closeDialog(d, done) {
    if (!d.open || d.classList.contains("is-closing")) { if (done) done(); return; }
    var finished = false;
    if (motionOff() && root.classList.contains("no-motion")) {
      d.close();
      openStack = openStack.filter(function (x) { return x !== d; });
      if (!openStack.length) root.classList.remove("is-locked");
      if (done) done();
      return;
    }
    d.classList.add("is-closing");
    function finish() {
      if (finished) return;
      finished = true;
      d.classList.remove("is-closing");
      d.close();
      openStack = openStack.filter(function (x) { return x !== d; });
      if (!openStack.length) document.documentElement.classList.remove("is-locked");
      if (done) done();
    }
    d.addEventListener("animationend", function h(e) {
      if (e.target !== d) return;
      d.removeEventListener("animationend", h);
      finish();
    });
    setTimeout(finish, 450);
  }
  $$("dialog").forEach(function (d) {
    d.addEventListener("cancel", function (e) { e.preventDefault(); closeDialog(d); });
    d.addEventListener("click", function (e) {
      if (e.target === d) {
        // clic sullo sfondo (fuori dal contenuto)
        var r = d.getBoundingClientRect();
        var inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (!inside) closeDialog(d);
      }
      var c = e.target.closest("[data-close]");
      if (c && d.contains(c)) closeDialog(d);
    });
  });

  /* ---------- Catalogo ---------- */
  var grid = $("#grid");
  var currentFilter = "tutti";
  var currentSort = "consigliati";

  function visibleProducts() {
    var list = PRODUCTS.filter(function (p) { return currentFilter === "tutti" || p.cat === currentFilter; });
    list.sort(function (a, b) {
      if (currentSort === "prezzo-asc") return a.price - b.price;
      if (currentSort === "prezzo-desc") return b.price - a.price;
      return a.rank - b.rank;
    });
    return list;
  }

  function renderGrid() {
    var list = visibleProducts();
    grid.innerHTML = "";
    list.forEach(function (p, i) {
      var img = el("img", { src: p.img, alt: p.alt, loading: "lazy", width: "600", height: "800" });
      markMissing(img);
      var link = el("button", { type: "button", className: "card-link", "data-open": p.id, "aria-label": p.name + ", " + euro(p.price) + ". Apri la scheda" }, [
        el("div", { className: "card-media" }, [img]),
        el("div", { className: "card-info" }, [
          el("span", { className: "card-name", text: p.name }),
          el("span", { className: "card-meta", text: CATEGORIES[p.cat] + " · " + p.colors.length + " colori" }),
          el("span", { className: "card-price", text: euro(p.price) })
        ])
      ]);
      var heart = el("button", { type: "button", className: "heart-btn", "data-wish": p.id }, [heartSvg()]);
      setHeart(heart, p);
      var li = el("li", { className: "card" }, [link, heart]);
      li.style.setProperty("--i", i);
      grid.appendChild(li);
    });
    var n = list.length;
    $("#resultCount").textContent = n === 1 ? "1 prodotto" : n + " prodotti";
  }

  var switching = false;
  function changeView(fn) {
    if (switching) { fn(); renderGrid(); return; }
    switching = true;
    grid.classList.add("is-leaving");
    setTimeout(function () {
      fn();
      grid.classList.remove("is-leaving");
      renderGrid();
      switching = false;
    }, 220);
  }

  $$(".chip").forEach(function (chip) {
    chip.addEventListener("click", function () {
      var f = chip.getAttribute("data-filter");
      if (f === currentFilter) return;
      $$(".chip").forEach(function (c) {
        var on = c === chip;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
      changeView(function () { currentFilter = f; });
    });
  });
  $("#sort").addEventListener("change", function (e) {
    var v = e.target.value;
    changeView(function () { currentSort = v; });
  });

  grid.addEventListener("click", function (e) {
    var w = e.target.closest("[data-wish]");
    if (w) { toggleWish(w.getAttribute("data-wish"), w); return; }
    var o = e.target.closest("[data-open]");
    if (o) openProduct(o.getAttribute("data-open"));
  });

  /* ---------- Preferiti ---------- */
  function isWished(id) { return wish.indexOf(id) !== -1; }
  function setHeart(btn, p) {
    var on = isWished(p.id);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.setAttribute("aria-label", on ? "Togli " + p.name + " dai preferiti" : "Aggiungi " + p.name + " ai preferiti");
  }
  function toggleWish(id, sourceBtn) {
    var p = byId[id];
    if (isWished(id)) wish = wish.filter(function (x) { return x !== id; });
    else wish.push(id);
    save(KEY_WISH, wish);
    var on = isWished(id);
    $$('[data-wish="' + id + '"]').forEach(function (b) { setHeart(b, p); });
    if (pmCurrent && pmCurrent.id === id) setHeart($("#pmWish"), p);
    if (sourceBtn && on) replay(sourceBtn, "pop");
    updateWishCount(true);
    renderWish();
    toast(on ? "Salvato nei preferiti: " + p.name : "Tolto dai preferiti: " + p.name);
  }
  function updateWishCount(animate) {
    var c = $("#wishCount");
    c.textContent = wish.length;
    c.classList.toggle("is-zero", wish.length === 0);
    $("#openWish").setAttribute("aria-label", "Preferiti, " + wish.length + (wish.length === 1 ? " articolo" : " articoli"));
    if (animate && wish.length) replay(c, "bump");
  }
  function renderWish() {
    var ul = $("#wishLines");
    ul.innerHTML = "";
    wish.forEach(function (id) {
      var p = byId[id];
      var img = el("img", { src: p.img, alt: "" });
      markMissing(img);
      var li = el("li", { className: "line" }, [
        el("div", { className: "line-media" }, [img]),
        el("div", {}, [
          el("div", { className: "line-top" }, [
            el("span", { className: "line-name", text: p.name }),
            el("span", { className: "line-price", text: euro(p.price) })
          ]),
          el("p", { className: "line-sub", text: CATEGORIES[p.cat] }),
          el("div", { className: "line-actions" }, [
            el("button", { type: "button", className: "link-btn link-strong", "data-view": id, text: "Vedi la scheda" }),
            el("button", { type: "button", className: "link-btn", "data-unwish": id, text: "Rimuovi", "aria-label": "Rimuovi " + p.name + " dai preferiti" })
          ])
        ])
      ]);
      ul.appendChild(li);
    });
    $("#wishEmpty").classList.toggle("is-shown", wish.length === 0);
  }
  $("#wishLines").addEventListener("click", function (e) {
    var v = e.target.closest("[data-view]");
    if (v) {
      var id = v.getAttribute("data-view");
      closeDialog($("#wishDrawer"), function () { openProduct(id); });
      return;
    }
    var u = e.target.closest("[data-unwish]");
    if (u) {
      var li = u.closest(".line");
      li.classList.add("is-removing");
      setTimeout(function () { toggleWish(u.getAttribute("data-unwish")); }, motionOff() ? 0 : 260);
    }
  });
  $("#openWish").addEventListener("click", function () { renderWish(); openDialog($("#wishDrawer")); });

  /* ---------- Scheda prodotto ---------- */
  var pmCurrent = null, pmColor = null, pmQty = 1;
  var pmImg = $("#pmImg");
  markMissing(pmImg);

  function openProduct(id) {
    var p = byId[id];
    pmCurrent = p; pmColor = p.colors[0][0]; pmQty = 1;
    pmImg.classList.remove("is-missing");
    pmImg.src = p.img;
    pmImg.alt = p.alt;
    // riavvia lo zoom d'ingresso
    pmImg.style.animation = "none";
    void pmImg.offsetWidth;
    pmImg.style.animation = "";
    $("#pmCat").textContent = CATEGORIES[p.cat];
    $("#pmCaption").textContent = "Foto: colore " + p.photo;
    $("#pmTitle").textContent = p.name;
    $("#pmPrice").textContent = euro(p.price);
    $("#pmDesc").textContent = p.desc;
    var dl = $("#pmSpecs");
    dl.innerHTML = "";
    p.specs.forEach(function (s) {
      dl.appendChild(el("div", {}, [el("dt", { text: s[0] }), el("dd", { text: s[1] })]));
    });
    var row = $("#pmSwatches");
    row.innerHTML = "";
    row.setAttribute("role", "radiogroup");
    row.setAttribute("aria-label", "Colore");
    p.colors.forEach(function (c, i) {
      var b = el("button", { type: "button", className: "swatch", role: "radio", "aria-checked": i === 0 ? "true" : "false", "aria-label": c[0], "data-color": c[0], tabindex: i === 0 ? "0" : "-1" }, [el("span")]);
      b.firstChild.style.setProperty("--c", c[1]);
      row.appendChild(b);
    });
    setHeart($("#pmWish"), p);
    updatePm();
    openDialog($("#productModal"));
    $("#productModal").scrollTop = 0;
  }
  function updatePm() {
    $("#pmColorName").textContent = pmColor;
    $("#pmQty").textContent = pmQty;
    $("#pmMinus").disabled = pmQty <= 1;
    $("#pmPlus").disabled = pmQty >= 9;
  }
  function selectSwatch(b, focus) {
    $$(".swatch", $("#pmSwatches")).forEach(function (s) {
      var on = s === b;
      s.setAttribute("aria-checked", on ? "true" : "false");
      s.setAttribute("tabindex", on ? "0" : "-1");
    });
    pmColor = b.getAttribute("data-color");
    if (focus) b.focus();
    updatePm();
  }
  $("#pmSwatches").addEventListener("click", function (e) {
    var b = e.target.closest(".swatch");
    if (b) selectSwatch(b, false);
  });
  $("#pmSwatches").addEventListener("keydown", function (e) {
    var keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"];
    if (keys.indexOf(e.key) === -1) return;
    e.preventDefault();
    var all = $$(".swatch", $("#pmSwatches"));
    var i = all.indexOf(document.activeElement);
    var step = (e.key === "ArrowRight" || e.key === "ArrowDown") ? 1 : -1;
    selectSwatch(all[(i + step + all.length) % all.length], true);
  });
  $("#pmMinus").addEventListener("click", function () { if (pmQty > 1) { pmQty--; updatePm(); } });
  $("#pmPlus").addEventListener("click", function () { if (pmQty < 9) { pmQty++; updatePm(); } });
  $("#pmWish").addEventListener("click", function () { if (pmCurrent) toggleWish(pmCurrent.id, $("#pmWish")); });
  $("#pmAdd").addEventListener("click", function () {
    if (!pmCurrent) return;
    addToCart(pmCurrent.id, pmColor, pmQty, true);
    closeDialog($("#productModal"), function () {
      renderCart();
      openDialog($("#cartDrawer"));
    });
  });

  /* ---------- Carrello ---------- */
  function addToCart(id, color, qty, silent) {
    var line = cart.filter(function (l) { return l.id === id && l.color === color; })[0];
    if (line) line.qty = Math.min(9, line.qty + qty);
    else cart.push({ id: id, color: color, qty: qty });
    save(KEY_CART, cart);
    updateCartCount(true);
    if (!silent) toast("Aggiunto al carrello: " + byId[id].name);
  }
  function cartTotals() {
    var items = 0, sub = 0;
    cart.forEach(function (l) { items += l.qty; sub += l.qty * byId[l.id].price; });
    var ship = sub === 0 || sub >= FREE_SHIP ? 0 : SHIP_COST;
    return { items: items, sub: sub, ship: ship, total: sub + ship };
  }
  function updateCartCount(animate) {
    var t = cartTotals();
    var c = $("#cartCount");
    c.textContent = t.items;
    c.classList.toggle("is-zero", t.items === 0);
    $("#openCart").setAttribute("aria-label", "Carrello, " + t.items + (t.items === 1 ? " articolo" : " articoli"));
    if (animate && t.items) replay(c, "bump");
  }
  function renderCart() {
    var t = cartTotals();
    var ul = $("#cartLines");
    ul.innerHTML = "";
    cart.forEach(function (l, idx) {
      var p = byId[l.id];
      var img = el("img", { src: p.img, alt: "" });
      markMissing(img);
      var li = el("li", { className: "line", "data-index": idx }, [
        el("div", { className: "line-media" }, [img]),
        el("div", {}, [
          el("div", { className: "line-top" }, [
            el("span", { className: "line-name", text: p.name }),
            el("span", { className: "line-price", text: euro(p.price * l.qty) })
          ]),
          el("p", { className: "line-sub", text: "Colore " + l.color + " · " + euro(p.price) + " cad." }),
          el("div", { className: "line-actions" }, [
            el("div", { className: "qty", role: "group", "aria-label": "Quantità di " + p.name }, [
              el("button", { type: "button", className: "qty-btn", "data-dec": idx, "aria-label": "Diminuisci quantità di " + p.name, text: "−" }),
              el("output", { text: String(l.qty), "aria-live": "polite" }),
              el("button", { type: "button", className: "qty-btn", "data-inc": idx, "aria-label": "Aumenta quantità di " + p.name, text: "+" })
            ]),
            el("button", { type: "button", className: "link-btn", "data-remove": idx, text: "Rimuovi", "aria-label": "Rimuovi " + p.name + " dal carrello" })
          ])
        ])
      ]);
      if (l.qty >= 9) li.querySelector("[data-inc]").disabled = true;
      ul.appendChild(li);
    });
    var empty = cart.length === 0;
    $("#cartEmpty").classList.toggle("is-shown", empty);
    $("#cartFoot").hidden = empty;
    $("#ship").hidden = empty;

    var missing = Math.max(0, FREE_SHIP - t.sub);
    $("#shipText").innerHTML = "";
    if (missing > 0) {
      $("#shipText").append("Ti mancano ", el("strong", { text: euro(missing) }), " per la spedizione gratuita.");
    } else {
      $("#shipText").append(el("strong", { text: "La spedizione è gratuita." }), " Il pacco parte assicurato.");
    }
    $("#shipFill").style.transform = "scaleX(" + Math.min(1, t.sub / FREE_SHIP) + ")";
    $("#shipBar").setAttribute("aria-valuenow", String(Math.min(FREE_SHIP, t.sub)));
    $("#subTotal").textContent = euro(t.sub);
    $("#shipCost").textContent = t.ship === 0 ? "Gratuita" : euro(t.ship);
    $("#grandTotal").textContent = euro(t.total);
  }
  $("#cartLines").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    var focusSel = null;
    if (b.hasAttribute("data-inc")) {
      var i = +b.getAttribute("data-inc");
      cart[i].qty = Math.min(9, cart[i].qty + 1);
      focusSel = '[data-inc="' + i + '"]';
    } else if (b.hasAttribute("data-dec")) {
      var j = +b.getAttribute("data-dec");
      cart[j].qty -= 1;
      if (cart[j].qty <= 0) { removeLine(j, b); return; }
      focusSel = '[data-dec="' + j + '"]';
    } else if (b.hasAttribute("data-remove")) {
      removeLine(+b.getAttribute("data-remove"), b);
      return;
    } else return;
    save(KEY_CART, cart);
    renderCart();
    updateCartCount(false);
    if (focusSel) { var f = $(focusSel, $("#cartLines")); if (f && !f.disabled) f.focus(); }
  });
  function removeLine(i, btn) {
    var li = btn.closest(".line");
    var name = byId[cart[i].id].name;
    li.classList.add("is-removing");
    setTimeout(function () {
      cart.splice(i, 1);
      save(KEY_CART, cart);
      renderCart();
      updateCartCount(false);
      toast("Tolto dal carrello: " + name);
      var next = $("#cartLines .qty-btn") || $("#cartEmpty .btn") ;
      if (next) next.focus();
    }, motionOff() ? 0 : 260);
  }
  $("#openCart").addEventListener("click", function () { renderCart(); openDialog($("#cartDrawer")); });

  $$("[data-goto-collection]").forEach(function (b) {
    b.addEventListener("click", function () {
      var d = b.closest("dialog");
      closeDialog(d, function () {
        $("#collezione").scrollIntoView({ behavior: motionOff() ? "auto" : "smooth" });
      });
    });
  });

  /* ---------- Pagamento (solo simulato) ---------- */
  var form = $("#coForm");
  var rules = {
    name: function (v) { return v.trim().length < 3 ? "Scrivi nome e cognome." : (v.trim().indexOf(" ") === -1 ? "Manca il cognome." : ""); },
    email: function (v) { return !v.trim() ? "Scrivi la tua email." : (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Questa email non sembra corretta: controlla la @ e il dominio."); },
    address: function (v) { return v.trim().length < 5 ? "Scrivi via e numero civico." : (/\d/.test(v) ? "" : "Manca il numero civico."); },
    cap: function (v) { return /^\d{5}$/.test(v.trim()) ? "" : "Il CAP ha 5 cifre."; },
    city: function (v) { return v.trim().length < 2 ? "Scrivi la città." : ""; }
  };
  var errIds = { name: "eName", email: "eEmail", address: "eAddress", cap: "eCap", city: "eCity" };

  function validateField(input) {
    var name = input.name;
    var msg = rules[name](input.value);
    $("#" + errIds[name]).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    input.classList.toggle("is-valid", !msg);
    return !msg;
  }
  $$("input", form).forEach(function (input) {
    input.addEventListener("blur", function () { if (input.value || input.getAttribute("aria-invalid")) validateField(input); });
    input.addEventListener("input", function () { if (input.getAttribute("aria-invalid") === "true") validateField(input); });
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var firstBad = null;
    $$("input", form).forEach(function (input) {
      if (!validateField(input) && !firstBad) firstBad = input;
    });
    if (firstBad) {
      firstBad.focus();
      replay(firstBad, "shake");
      return;
    }
    if (!cart.length) return;
    // Nessun invio: si genera solo un numero d'ordine fittizio.
    var n = "OA-" + new Date().getFullYear() + "-" + String(Math.floor(100000 + Math.random() * 900000));
    $("#orderNo").textContent = n;
    cart = [];
    save(KEY_CART, cart);
    updateCartCount(false);
    renderCart();
    form.reset();
    $$("input", form).forEach(function (i) { i.removeAttribute("aria-invalid"); i.classList.remove("is-valid"); });
    $$(".err", form).forEach(function (x) { x.textContent = ""; });
    $("#coFormView").hidden = true;
    $("#coDoneView").hidden = false;
    $("#coDoneView").focus();
  });

  function openCheckout() {
    var t = cartTotals();
    $("#coItems").textContent = t.items + (t.items === 1 ? " articolo · " : " articoli · ") + euro(t.sub);
    $("#coShip").textContent = t.ship === 0 ? "Gratuita" : euro(t.ship);
    $("#coTotal").textContent = euro(t.total);
    $("#coFormView").hidden = false;
    $("#coDoneView").hidden = true;
    openDialog($("#checkoutModal"));
    $("#checkoutModal").scrollTop = 0;
  }
  $("#toCheckout").addEventListener("click", function () {
    if (!cart.length) return;
    closeDialog($("#cartDrawer"), openCheckout);
  });

  /* ---------- Movimento allo scorrimento ---------- */
  var header = $(".site-header");
  var heroImg = $("#heroImg");
  markMissing(heroImg);
  var hero = $(".hero");
  var scene = $("#scene");
  var sceneImgs = $$(".scene-img");
  var sceneSteps = $$(".step");
  var sceneBar = $("#sceneBar");
  var currentStep = -1;
  var ticking = false;

  function setStep(i) {
    if (i === currentStep) return;
    currentStep = i;
    sceneImgs.forEach(function (img) { img.classList.toggle("is-active", +img.getAttribute("data-step") === i); });
    sceneSteps.forEach(function (st) { st.classList.toggle("is-current", +st.getAttribute("data-step") === i); });
  }

  function updateSceneMode() {
    var on = !motionOff();
    root.classList.toggle("scene-on", on);
    if (!on) {
      // passi uno sotto l'altro: tutti in evidenza, prima foto
      sceneSteps.forEach(function (st) { st.classList.add("is-current"); });
      sceneImgs.forEach(function (img, k) { img.classList.toggle("is-active", k === 0); });
      currentStep = -1;
    } else {
      sceneSteps.forEach(function (st) { st.classList.remove("is-current"); });
      currentStep = -1;
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle("is-scrolled", y > 8);
      if (!motionOff()) {
        var h = hero.offsetHeight;
        if (y < h + 200) heroImg.style.transform = "translate3d(0," + (y * 0.22).toFixed(1) + "px,0) scale(1.04)";
      } else {
        heroImg.style.transform = "";
      }
      if (root.classList.contains("scene-on")) {
        var r = scene.getBoundingClientRect();
        var sticky = scene.firstElementChild.offsetHeight;
        var span = Math.max(1, r.height - sticky);
        var p = Math.max(0, Math.min(1, -r.top / span));
        setStep(Math.min(2, Math.floor(p * 3)));
        var local = (p * 3) - Math.min(2, Math.floor(p * 3));
        scene.style.setProperty("--zoom", (1.02 + local * 0.08).toFixed(3));
        sceneBar.parentNode.style.setProperty("--p", p.toFixed(3));
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  // l'animazione d'ingresso usa transform: la lasciamo finire prima di gestire la profondità
  heroImg.addEventListener("animationend", function () { heroImg.style.animation = "none"; onScroll(); });

  var io = null;
  function revealAll() { $$(".reveal").forEach(function (n) { n.classList.add("is-in"); }); }
  if ("IntersectionObserver" in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    $$(".reveal").forEach(function (n) {
      var sib = n.parentElement ? $$(":scope > .reveal", n.parentElement) : [];
      var k = sib.indexOf(n);
      if (k > 0) n.style.transitionDelay = Math.min(k, 4) * 90 + "ms";
      io.observe(n);
    });
  } else {
    revealAll();
  }
  $$("img[data-fallback]").forEach(markMissing);

  /* ---------- Interruttore animazioni ---------- */
  var animBtn = $(".anim");
  function syncAnimBtn() {
    var off = root.classList.contains("no-motion");
    animBtn.textContent = off ? "Riattiva le animazioni" : "Disattiva le animazioni";
    animBtn.setAttribute("aria-pressed", off ? "true" : "false");
  }
  animBtn.addEventListener("click", function () {
    var off = !root.classList.contains("no-motion");
    root.classList.toggle("no-motion", off);
    try { localStorage.setItem(KEY_MOTION, off ? "1" : "0"); } catch (e) { /* ignora */ }
    if (off) revealAll();
    syncAnimBtn();
    updateSceneMode();
    onScroll();
    toast(off ? "Animazioni disattivate" : "Animazioni riattivate");
  });
  if (reduceMotion.addEventListener) reduceMotion.addEventListener("change", function () { updateSceneMode(); onScroll(); });
  if (root.classList.contains("no-motion")) revealAll();
  syncAnimBtn();
  updateSceneMode();

  /* ---------- Avvio ---------- */
  renderGrid();
  renderWish();
  renderCart();
  updateCartCount(false);
  updateWishCount(false);
  onScroll();
})();
