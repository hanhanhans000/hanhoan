(function () {
    const yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    const header = document.querySelector(".site-header");
    const navHeight = header ? header.offsetHeight : 0;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            const id = this.getAttribute("href");
            if (!id || id === "#") return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
            window.scrollTo({ top: top, behavior: "smooth" });
        });
    });

    const modal = document.getElementById("project-modal");
    const modalMeta = modal?.querySelector(".modal__meta");
    const modalDesc = modal?.querySelector(".modal__description");
    const modalTags = modal?.querySelector(".modal__tags");
    const modalClose = modal?.querySelector(".modal__close");

    const projectData = {
        1: {
            year: "Dec 2025",
            category: "Web",
            title: "Keep Magazine",
            description: "Publishing systems, directory logic, editorial structure.",
            tags: "Publishing · Directory · Editorial",
        },
        2: {
            year: "2024",
            category: "Web",
            title: "Loops.szn",
            description: "Interactive portfolio with floating windows and motion.",
            tags: "UI · Interactive · Portfolio",
        },
        3: {
            year: "2025",
            category: "Direction",
            title: "Editorial Spreads",
            description: "Editorial spreads and print exploration.",
            tags: "Editorial · Print · Mixed media",
        },
        4: {
            year: "2025",
            category: "Content",
            title: "Content Design",
            description: "Short-form and editorial video for platforms.",
            tags: "Video · Motion · Social",
        },
        5: {
            year: "Ongoing",
            category: "Content",
            title: "Shovel Studio",
            description: "Design and visual briefs for Shovel Studio.",
            tags: "Systems · Strategy · Reels",
        },
        6: {
            year: "Sep 2025",
            category: "Direction",
            title: "Dog Tags",
            description: "Direction notes and material decisions.",
            tags: "Direction · Marketing · Graphic design",
        },
    };

    function openModal(data) {
        if (!modal || !modalMeta || !modalDesc || !modalTags) return;
        modalMeta.innerHTML =
            '<span class="modal-year">' +
            data.year +
            '</span> · <strong>' +
            data.category +
            "</strong> — " +
            data.title;
        modalDesc.textContent = data.description;
        modalTags.textContent = data.tags;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        modalClose?.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    document.querySelectorAll(".project-row").forEach(function (row) {
        row.addEventListener("click", function () {
            const id = this.getAttribute("data-project");
            const data = projectData[id];
            if (data) openModal(data);
        });
    });

    modalClose?.addEventListener("click", closeModal);

    modal?.addEventListener("click", function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal && !modal.hidden) closeModal();
    });
})();
