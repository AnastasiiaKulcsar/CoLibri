const themeStorageKey = "colibri-theme";
const supportedThemes = ["light", "dark"];

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
}

function saveTheme(theme) {
    if (!supportedThemes.includes(theme)) {
        throw new Error(`Unbekanntes CoLibri-Theme: ${theme}`);
    }

    try {
        localStorage.setItem(themeStorageKey, theme);
    } catch (error) {
        console.error("Die Theme-Einstellung konnte nicht gespeichert werden.", error);
        throw error;
    }

    applyTheme(theme);
}

try {
    const savedTheme = localStorage.getItem(themeStorageKey);
    if (savedTheme && supportedThemes.includes(savedTheme)) {
        applyTheme(savedTheme);
    } else if (savedTheme) {
        console.error("Die gespeicherte CoLibri-Theme-Einstellung ist ungültig.");
    }
} catch (error) {
    console.error("Die CoLibri-Theme-Einstellung konnte nicht geladen werden.", error);
}

document.addEventListener("DOMContentLoaded", () => {
    const themeOptions = document.querySelectorAll('input[name="theme"]');
    const feedback = document.querySelector("[data-theme-feedback]");

    themeOptions.forEach((option) => {
        option.checked = option.value === (document.documentElement.dataset.theme || "light");
        option.addEventListener("change", () => {
            if (!option.checked) {
                return;
            }

            try {
                saveTheme(option.value);
                if (feedback) {
                    feedback.textContent = option.value === "dark"
                        ? "Dunkles Design für CoLibri aktiviert."
                        : "Helles Design für CoLibri aktiviert.";
                }
            } catch (error) {
                if (feedback) {
                    feedback.textContent = "Die Einstellung konnte nicht gespeichert werden.";
                }
                option.checked = false;
                const activeTheme = document.documentElement.dataset.theme || "light";
                document.querySelector(`input[name="theme"][value="${activeTheme}"]`).checked = true;
            }
        });
    });
});
