document.addEventListener("DOMContentLoaded", () => {
  // --- BOUNCE NAV LOGIC ---
  const menuToggle = document.getElementById("menu-toggle");
  const navOverlay = document.querySelector(".nav-overlay");
  const navWrapper = document.querySelector(".nav-wrapper");
  const navLinks = document.querySelectorAll(".nav-links a");

  let isMenuOpen = false;

  const openMenu = () => {
    isMenuOpen = true;
    navOverlay.classList.add("active");
    navWrapper.classList.add("open");
    menuToggle.textContent = "✕";
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    isMenuOpen = false; // Set state immediately
    navOverlay.classList.remove("active");
    navWrapper.classList.remove("open");
    navWrapper.classList.add("closing");

    setTimeout(() => {
      navWrapper.classList.remove("closing");
    }, 600);

    menuToggle.textContent = "☰";
    document.body.style.overflow = "";
  };

  if (menuToggle && navOverlay && navWrapper) {
    // Toggle Button
    menuToggle.addEventListener("click", (e) => {
      e.stopPropagation();
      if (isMenuOpen) closeMenu();
      else openMenu();
    });

    // Close when clicking outside (on overlay)
    navOverlay.addEventListener("click", (e) => {
      if (e.target === navOverlay) {
        closeMenu();
      }
    });

    // Close when clicking ANY nav link
    navLinks.forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    });
  }

  // --- THEME TOGGLE LOGIC ---
  const themeToggle = document.querySelector(".theme-toggle-fixed");
  const html = document.documentElement;
  // Check local storage
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light") {
    html.classList.add("light-mode");
    if (themeToggle) themeToggle.textContent = "☀️";
  } else {
    if (themeToggle) themeToggle.textContent = "🌙";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      html.classList.toggle("light-mode");
      const isLight = html.classList.contains("light-mode");
      localStorage.setItem("theme", isLight ? "light" : "dark");
      themeToggle.textContent = isLight ? "☀️" : "🌙";
    });
  }

  // --- SCROLL SPY & SIDE NAV (If present) ---
  const sections = document.querySelectorAll("section[id]");
  const navDots = document.querySelectorAll(".nav-dot");

  function scrollActive() {
    const scrollY = window.pageYOffset;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 200; // Offset
      const sectionId = current.getAttribute("id");

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        // Remove active from all dots
        navDots.forEach((dot) => dot.classList.remove("active"));
        // Add active to current dot
        const activeDot = document.querySelector(
          `.nav-dot[data-target="${sectionId}"]`,
        );
        if (activeDot) activeDot.classList.add("active");
      }
    });
  }

  if (sections.length > 0 && navDots.length > 0) {
    window.addEventListener("scroll", scrollActive);

    // Dot click
    navDots.forEach((dot) => {
      dot.addEventListener("click", () => {
        const targetId = dot.getAttribute("data-target");
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          window.scrollTo({
            top: targetSection.offsetTop - 80,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // --- SCROLL ANIMATIONS (Intersection Observer) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target); // Animate once
      }
    });
  }, observerOptions);

  // Apply animation to key elements
  document
    .querySelectorAll(
      ".hero-title, .hero-subtitle, .project-item, .education-item, .gateway-card",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // --- MODAL PREVIEW LOGIC ---
  const modal = document.getElementById("preview-modal");
  const modalFrame = document.getElementById("preview-frame");
  const closeBtn = document.querySelector(".close-modal");
  const previewBtns = document.querySelectorAll(".preview-btn");

  if (modal && modalFrame && closeBtn) {
    previewBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const url = btn.getAttribute("data-url");
        if (url) {
          modalFrame.src = url;
          modal.classList.add("show");
          document.body.style.overflow = "hidden"; // Prevent background scrolling
        }
      });
    });

    const closeModal = () => {
      modal.classList.remove("show");
      document.body.style.overflow = "";
      setTimeout(() => {
        modalFrame.src = ""; // Stop video/content
      }, 300);
    };

    closeBtn.addEventListener("click", closeModal);

    // Close on outside click
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && modal.classList.contains("show")) {
        closeModal();
      }
    });
  }

  // --- CURSOR FOLLOWER LOGIC ---
  const follower = document.createElement("div");
  follower.classList.add("cursor-follower");
  document.body.appendChild(follower);

  let mouseX = 0;
  let mouseY = 0;
  let followerX = 0;
  let followerY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateFollower() {
    // Smooth lerp
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
  }

  animateFollower();
});
