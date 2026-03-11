// ========= Utilities =========
function $(id) {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element: #${id}`);
  return el;
}

function showToast(toastEl, msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  window.setTimeout(() => toastEl.classList.remove("show"), 1100);
}

// ========= Component: Clocks =========
function initClocks() {
  const tBog = $("tBog");
  const tTyo = $("tTyo");
  const tOsl = $("tOsl");

  const fmt = (tz) => new Intl.DateTimeFormat([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: tz
  });

  function tick() {
    const now = new Date();
    tBog.textContent = fmt("America/Bogota").format(now);
    tTyo.textContent = fmt("Asia/Tokyo").format(now);
    tOsl.textContent = fmt("Europe/Oslo").format(now);
  }

  tick();
  window.setInterval(tick, 1000);
}

// ========= Component: Modal =========
function initModal(toastEl) {
  const backdrop = $("modalBackdrop");
  const btnContact = $("btnContact");
  const btnClose = $("btnClose");
  const btnCopy = $("btnCopy");

  function openModal() {
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    btnClose.focus();
  }

  function closeModal() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
  }

  btnContact.addEventListener("click", openModal);
  btnClose.addEventListener("click", closeModal);

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) closeModal();
  });

  btnCopy.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("julianhiki@gmail.com");
      showToast(toastEl, "EMAIL COPIED");
    } catch {
      showToast(toastEl, "COPY FAILED");
    }
  });

  return { openModal, closeModal, isOpen: () => backdrop.classList.contains("open") };
}

// ========= Component: Zen Mode =========
function initZen() {
  const zenScreen = $("zenScreen");

  function setZen(on) {
    document.body.classList.toggle("zen", on);
    zenScreen.setAttribute("aria-hidden", on ? "false" : "true");
  }

  function isZen() {
    return document.body.classList.contains("zen");
  }

  return { setZen, isZen };
}

// ========= Component: Portrait Hover Random =========
function initPortraitHover() {
  const wrap = $("portraitWrap");
  const hello = $("hello");

  const hoverTexts = ["Saludos terricola", "si, si, ¡SI!", "Erre", "Eureka"];

  // Si lo quieres EXACTO en la punta, deja 0.
  // Si no quieres que tape el cursor, usa 8–14.
  const offsetX = 0;
  const offsetY = 0;

  let raf = 0;
  let lastEvt = null;

  function randomHello() {
    hello.textContent = hoverTexts[Math.floor(Math.random() * hoverTexts.length)];
  }

  function moveHello(e) {
    hello.style.left = (e.clientX + offsetX) + "px";
    hello.style.top  = (e.clientY + offsetY) + "px";
  }

  wrap.addEventListener("mouseenter", (e) => {
    randomHello();
    hello.classList.add("is-on");
    moveHello(e);
  });

  wrap.addEventListener("mousemove", (e) => {
    lastEvt = e;
    if (raf) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      if (lastEvt) moveHello(lastEvt);
    });
  });

  wrap.addEventListener("mouseleave", () => {
    hello.classList.remove("is-on");
  });
}

// ========= Component: Shortcuts =========
function initShortcuts({ modal, zen }) {
  // TAB => Contact
  function handleTab(e) {
    if (e.key !== "Tab") return;
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) return;

    e.preventDefault();

    if (zen.isZen()) zen.setZen(false);
    modal.openModal();
  }

  // ESC => close modal (si abierto) + toggle zen
  function handleEsc(e) {
    if (e.key !== "Escape") return;

    if (modal.isOpen()) modal.closeModal();

    zen.setZen(!zen.isZen());
  }

  window.addEventListener("keydown", (e) => {
    handleTab(e);
    handleEsc(e);
  });
}

// ========= Component: Archive Placeholder =========
function initArchive(toastEl) {
  const btnArchive = $("btnArchive");
  btnArchive.addEventListener("click", () => showToast(toastEl, "ARCHIVE: PENDING"));
}

// ========= Boot =========
(function boot() {
  const toastEl = $("toast");

  initClocks();
  initPortraitHover();

  const zen = initZen();
  const modal = initModal(toastEl);

  initShortcuts({ modal, zen });
  initArchive(toastEl);
})();
