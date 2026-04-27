(function () {
    "use strict";

    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var loader = document.getElementById("page-loader");
    var loadStart = Date.now();
    var minShow = 850;

    function finishLoader() {
        if (!loader) {
            document.body.classList.remove("page-loading");
            return;
        }
        loader.setAttribute("aria-busy", "false");
        setTimeout(function () {
            loader.classList.add("page-loader--exit");
            document.body.classList.remove("page-loading");
            setTimeout(function () {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                }
            }, 580);
        }, 80);
    }

    if (!reduceMotion) {
        document.body.classList.add("page-loading");
        if (loader) {
            window.addEventListener("load", function () {
                var elapsed = Date.now() - loadStart;
                var wait = Math.max(0, minShow - elapsed);
                setTimeout(finishLoader, wait);
            });

            setTimeout(function () {
                if (loader && loader.parentNode && !loader.classList.contains("page-loader--exit")) {
                    finishLoader();
                }
            }, 8000);
        } else {
            document.body.classList.remove("page-loading");
        }
    } else if (loader) {
        loader.setAttribute("aria-busy", "false");
        loader.classList.add("page-loader--exit");
        document.body.classList.remove("page-loading");
        setTimeout(function () {
            if (loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }, 200);
    }

    var yearEl = document.getElementById("current-year");
    if (yearEl) {
        yearEl.textContent = String(new Date().getFullYear());
    }

    var header = document.querySelector(".site-header");
    var navHeight = header ? header.offsetHeight : 72;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var id = anchor.getAttribute("href");
            if (!id || id === "#") return;
            var target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
            window.scrollTo({ top: top, behavior: reduceMotion ? "auto" : "smooth" });
        });
    });

    document.querySelectorAll(".project-row[data-external]").forEach(function (row) {
        row.addEventListener("click", function () {
            var url = row.getAttribute("data-external");
            if (url) window.open(url, "_blank", "noopener,noreferrer");
        });
    });

    function initParallax() {
        if (reduceMotion) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;

        document.querySelectorAll("[data-parallax]").forEach(function (root) {
            var floats = root.querySelectorAll("[data-parallax-depth]");
            if (!floats.length) return;

            var targetX = 0;
            var targetY = 0;
            var curX = 0;
            var curY = 0;
            var lerp = 0.12;

            function onMove(e) {
                var r = root.getBoundingClientRect();
                var cx = r.left + r.width / 2;
                var cy = r.top + r.height / 2;
                var nx = (e.clientX - cx) / ((r.width / 2) || 1);
                var ny = (e.clientY - cy) / ((r.height / 2) || 1);
                targetX = Math.max(-1, Math.min(1, nx));
                targetY = Math.max(-1, Math.min(1, ny));
            }

            root.addEventListener("pointermove", onMove);
            root.addEventListener("pointerleave", function () {
                targetX = 0;
                targetY = 0;
            });

            function tick() {
                curX += (targetX - curX) * lerp;
                curY += (targetY - curY) * lerp;
                floats.forEach(function (el) {
                    var d = parseFloat(el.getAttribute("data-parallax-depth") || "0");
                    var mx = curX * d * 28;
                    var my = curY * d * 22;
                    el.style.setProperty("--mx", mx + "px");
                    el.style.setProperty("--my", my + "px");
                });
                requestAnimationFrame(tick);
            }
            requestAnimationFrame(tick);
        });
    }

    function initIdBadge() {
        var card = document.getElementById("name-card");
        var rig = document.getElementById("name-card-handle");
        var restoreBtn = document.getElementById("name-card-restore");
        if (!card || !rig) return;

        var dx = 0;
        var dy = 0;
        var dragging = false;
        var pointerId = null;
        var startClientX = 0;
        var startClientY = 0;
        var startDx = 0;
        var startDy = 0;
        var maxMove = 0;
        var tapThreshold = 10;
        var lastEventTarget = null;
        var lastMx = 0;
        var lastMy = 0;

        function setLifted(on) {
            if (reduceMotion) return;
            if (card.classList.contains("is-dismissed")) return;
            card.classList.toggle("is-lifted", !!on);
        }

        document.addEventListener("pointerup", function () {
            setLifted(false);
        });
        document.addEventListener("pointercancel", function () {
            setLifted(false);
        });

        function applyTransform() {
            card.style.setProperty("--card-dx", dx + "px");
            card.style.setProperty("--card-dy", dy + "px");
        }

        function dock() {
            dx = 0;
            dy = 0;
            applyTransform();
        }

        function dismissCard() {
            if (card.classList.contains("is-dismissed")) return;
            dock();
            card.classList.remove("is-lifted", "is-dragging");
            void card.offsetWidth;
            card.classList.add("is-dismissed");
            card.setAttribute("aria-hidden", "true");
            rig.setAttribute("tabindex", "-1");
            if (restoreBtn) {
                restoreBtn.hidden = false;
                restoreBtn.focus();
            }
        }

        function restoreCard() {
            card.classList.add("id-badge--no-transition");
            card.classList.remove("is-dismissed");
            card.removeAttribute("aria-hidden");
            rig.setAttribute("tabindex", "0");
            void card.offsetWidth;
            card.classList.remove("id-badge--no-transition");
            if (restoreBtn) {
                restoreBtn.hidden = true;
            }
        }

        if (restoreBtn) {
            restoreBtn.addEventListener("click", function () {
                restoreCard();
            });
        }

        rig.addEventListener("pointerdown", function (e) {
            if (card.classList.contains("is-dismissed")) return;
            if (e.pointerType === "mouse" && e.button !== 0) return;
            setLifted(true);
            if (e.target.closest("a")) return;
            dragging = true;
            maxMove = 0;
            lastMx = 0;
            lastMy = 0;
            card.classList.add("is-dragging");
            startClientX = e.clientX;
            startClientY = e.clientY;
            startDx = dx;
            startDy = dy;
            pointerId = e.pointerId;
            try {
                rig.setPointerCapture(pointerId);
            } catch (err) {
                /* ignore */
            }
        });

        rig.addEventListener("pointermove", function (e) {
            if (!dragging) return;
            var mx = e.clientX - startClientX;
            var my = e.clientY - startClientY;
            lastMx = mx;
            lastMy = my;
            maxMove = Math.max(maxMove, Math.hypot(mx, my));
            var nextDx = startDx + mx;
            var nextDy = startDy + my;
            var pad = 12;
            var w = card.offsetWidth;
            var h = card.offsetHeight;
            var maxDx = Math.max(0, (window.innerWidth - w) / 2 - pad);
            var maxDy = Math.max(0, (window.innerHeight - h) / 2 - pad);
            dx = Math.max(-maxDx, Math.min(maxDx, nextDx));
            dy = Math.max(-maxDy, Math.min(maxDy, nextDy));
            applyTransform();
        });

        function endDrag(e) {
            if (!dragging) return;
            dragging = false;
            lastEventTarget = e.target;
            card.classList.remove("is-dragging");
            if (pointerId != null) {
                try {
                    rig.releasePointerCapture(pointerId);
                } catch (err) {
                    /* ignore */
                }
                pointerId = null;
            }

            if (lastEventTarget && lastEventTarget.closest("a")) {
                dock();
                return;
            }

            var mx = lastMx;
            var my = lastMy;
            var absMx = Math.abs(mx);
            var absMy = Math.abs(my);

            if (maxMove < tapThreshold) {
                dismissCard();
                return;
            }

            if (my < -56 && absMy > absMx * 1.12) {
                dismissCard();
                return;
            }

            dock();
        }

        rig.addEventListener("pointerup", endDrag);
        rig.addEventListener("pointercancel", endDrag);

        rig.addEventListener("keydown", function (e) {
            if (card.classList.contains("is-dismissed")) return;
            if (e.key !== "Enter" && e.key !== " ") return;
            e.preventDefault();
            dismissCard();
        });
    }

    initParallax();
    initIdBadge();
})();
