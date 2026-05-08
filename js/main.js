document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector(".eco-navbar");
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navCollapse = document.querySelector(".navbar-collapse");
  const contactForm = document.querySelector("#contactForm");
  const formAlert = document.querySelector("#formAlert");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canTilt = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion;

  const updateNavbar = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
  };

  updateNavbar();
  updateScrollProgress();
  window.addEventListener("scroll", updateNavbar, { passive: true });
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress, { passive: true });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse.classList.contains("show")) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    if (element.closest(".hero-section")) {
      element.classList.add("is-visible");
      return;
    }

    revealObserver.observe(element);
  });

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.55 }
  );

  document.querySelectorAll("[data-counter]").forEach((counter) => {
    counterObserver.observe(counter);
  });

  if (canTilt) {
    document.querySelectorAll("[data-tilt]").forEach((element) => {
      element.addEventListener("mousemove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        element.style.transform = `perspective(900px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-4px)`;
      });

      element.addEventListener("mouseleave", () => {
        element.style.transform = "";
      });
    });
  }

  function animateCounter(counter) {
    const target = Number(counter.dataset.counter);
    const duration = 1200;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      formAlert.classList.remove("is-visible");

      if (!contactForm.checkValidity()) {
        contactForm.classList.add("was-validated");
        return;
      }

      contactForm.classList.remove("was-validated");
      contactForm.reset();
      formAlert.textContent = "Mensaje enviado correctamente. EcoByte se pondrá en contacto contigo pronto.";
      formAlert.classList.add("is-visible");
    });
  }
});
