(function () {
    "use strict";

    var yearEl = document.getElementById("js-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        var nodes = document.querySelectorAll(".reveal");
        if (nodes.length && "IntersectionObserver" in window) {
            var io = new IntersectionObserver(
                function (entries) {
                    entries.forEach(function (e) {
                        if (e.isIntersecting) {
                            e.target.classList.add("reveal--visible");
                            io.unobserve(e.target);
                        }
                    });
                },
                { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
            );
            nodes.forEach(function (n) {
                io.observe(n);
            });
        } else {
            nodes.forEach(function (n) {
                n.classList.add("reveal--visible");
            });
        }
    } else {
        document.querySelectorAll(".reveal").forEach(function (n) {
            n.classList.add("reveal--visible");
        });
    }
})();
