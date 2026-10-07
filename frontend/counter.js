/* Visitor counter for munir-portal.
   Tries POST /api/visits (served by the FastAPI backend).
   On static hosting the endpoint does not exist yet — fail silently
   and leave the footer untouched. */
(function () {
    "use strict";

    function render(count) {
        var el = document.getElementById("visitor-count");
        if (el && typeof count === "number" && count > 0) {
            el.textContent = "Visitor #" + count;
        }
    }

    try {
        fetch("/api/visits", { method: "POST" })
            .then(function (response) {
                if (!response.ok) throw new Error("no backend");
                return response.json();
            })
            .then(function (data) {
                if (data && data.visits) render(data.visits);
            })
            .catch(function () {
                /* static hosting: no backend yet, stay invisible */
            });
    } catch (e) {
        /* very old browser: stay invisible */
    }
})();
