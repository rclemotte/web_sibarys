// Configuración: número de WhatsApp institucional en formato internacional, sin + ni espacios.
// Ejemplo: "595981123456". Mientras esté vacío, los botones de WhatsApp llevan al formulario.
const WHATSAPP = "";

document.addEventListener("DOMContentLoaded", () => {
  // Menú en celular
  const nav = document.querySelector(".nav");
  const btnMenu = document.querySelector(".btn-menu");
  if (nav && btnMenu) {
    btnMenu.addEventListener("click", () => {
      const abierto = nav.classList.toggle("abierto");
      btnMenu.setAttribute("aria-expanded", abierto ? "true" : "false");
    });
    nav.querySelectorAll(".nav-links a").forEach((a) =>
      a.addEventListener("click", () => nav.classList.remove("abierto"))
    );
  }

  // Botones de WhatsApp
  document.querySelectorAll("[data-whatsapp]").forEach((a) => {
    if (WHATSAPP) {
      a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hola Sibarys, quisiera una cotización.")}`;
      a.target = "_blank";
      a.rel = "noopener";
    } else {
      a.href = a.dataset.whatsapp || "#contacto";
    }
  });

  // Pestañas (flota en Inicio, servicios en Servicios)
  document.querySelectorAll("[data-visor]").forEach((visor) => {
    const datos = JSON.parse(visor.querySelector("script[type='application/json']").textContent);
    const tabs = visor.querySelectorAll("[role='tab']");
    const set = (sel, val) => {
      visor.querySelectorAll(`[data-campo='${sel}']`).forEach((el) => {
        if (el.tagName === "IMG") {
          el.style.opacity = "0";
          setTimeout(() => {
            el.src = val.foto;
            el.alt = val.alt;
            el.style.objectPosition = val.pos || "center";
            el.onload = () => (el.style.opacity = "1");
          }, 150);
        } else {
          el.textContent = val[sel];
        }
      });
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.setAttribute("aria-selected", "false"));
        tab.setAttribute("aria-selected", "true");
        const d = datos[i];
        ["foto", "etiqueta", "nombre", "texto", "unidades", "num"].forEach((c) => set(c, d));
      });
    });
  });

  // Formulario de cotización
  const form = document.querySelector(".formulario");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const aviso = form.querySelector(".aviso-form");
      if (!f.get("nombre") || !f.get("telefono")) {
        aviso.textContent = "Complete al menos su nombre y teléfono.";
        return;
      }
      const texto =
        `Hola Sibarys, quisiera una cotización.\n` +
        `Nombre: ${f.get("nombre")}\nEmpresa: ${f.get("empresa") || "-"}\n` +
        `Teléfono: ${f.get("telefono")}\nServicio: ${f.get("servicio")}\n` +
        `Detalle: ${f.get("mensaje") || "-"}`;
      if (WHATSAPP) {
        window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener");
        aviso.textContent = "¡Listo! Se abrió WhatsApp con su solicitud.";
      } else {
        aviso.textContent = "Gracias. Muy pronto este formulario quedará habilitado.";
      }
    });
  }
});
