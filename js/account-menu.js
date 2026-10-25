document.querySelectorAll("[data-account-section]").forEach((button) => {
    button.addEventListener("click", () => {
        const menu = button.closest("[data-account-menu]");
        const feedback = menu.querySelector("[data-account-feedback]");
        const section = button.dataset.accountSection;
        feedback.textContent = `${section} sind in dieser Demo geöffnet.`;
    });
});

document.addEventListener("click", (event) => {
    document.querySelectorAll("[data-account-menu][open]").forEach((menu) => {
        if (!menu.contains(event.target)) {
            menu.removeAttribute("open");
        }
    });
});

const teamDeadlineStorageKey = "colibri-campus-lab-team-deadline";
let currentTeamDeadline = "2026-10-30";
const teamDeadlineElements = document.querySelectorAll("[data-team-deadline]");
const teamDeadlineMetricElements = document.querySelectorAll("[data-team-deadline-metric]");
const teamDeadlineToggle = document.querySelector("[data-toggle-team-deadline]");
const teamDeadlineForm = document.querySelector("[data-team-deadline-form]");
const teamDeadlineInput = document.getElementById("team-deadline-input");
const teamDeadlineFeedback = document.querySelector("[data-team-deadline-feedback]");

function isValidTeamDeadline(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return false;
    }

    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

function formatTeamDeadline(value) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day).toLocaleDateString("de-DE", {
        day: "numeric",
        month: "long",
    });
}

function updateTeamDeadlineDisplay(value) {
    currentTeamDeadline = value;
    const formattedDeadline = formatTeamDeadline(value);
    const [year] = value.split("-");
    teamDeadlineElements.forEach((element) => {
        element.textContent = `Abgabe am ${formattedDeadline}`;
    });
    teamDeadlineMetricElements.forEach((element) => {
        element.textContent = `${formattedDeadline} ${year} · Prototyp & Bericht`;
    });
}

try {
    const savedDeadline = localStorage.getItem(teamDeadlineStorageKey);
    if (savedDeadline && isValidTeamDeadline(savedDeadline)) {
        updateTeamDeadlineDisplay(savedDeadline);
        if (teamDeadlineInput) {
            teamDeadlineInput.value = savedDeadline;
        }
    } else if (savedDeadline) {
        console.error("Das gespeicherte Team-Abgabedatum ist ungültig.");
    }
} catch (error) {
    console.error("Das Team-Abgabedatum konnte nicht aus dem Browserspeicher geladen werden.", error);
    if (teamDeadlineFeedback) {
        teamDeadlineFeedback.textContent = "Das gespeicherte Abgabedatum konnte nicht geladen werden.";
    }
}

if (teamDeadlineToggle && teamDeadlineForm && teamDeadlineInput) {
    teamDeadlineToggle.addEventListener("click", () => {
        teamDeadlineForm.hidden = !teamDeadlineForm.hidden;
        if (!teamDeadlineForm.hidden) {
            teamDeadlineInput.value = currentTeamDeadline;
        }
    });

    teamDeadlineForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!isValidTeamDeadline(teamDeadlineInput.value)) {
            teamDeadlineFeedback.textContent = "Bitte gib ein gültiges Abgabedatum ein.";
            return;
        }

        try {
            localStorage.setItem(teamDeadlineStorageKey, teamDeadlineInput.value);
            updateTeamDeadlineDisplay(teamDeadlineInput.value);
            teamDeadlineFeedback.textContent = "Team-Abgabedatum gespeichert. Es ist in diesem Browser verfügbar.";
        } catch (error) {
            teamDeadlineFeedback.textContent = "Das Abgabedatum konnte nicht gespeichert werden.";
            console.error("Das Team-Abgabedatum konnte nicht im Browserspeicher gespeichert werden.", error);
        }
    });
}
