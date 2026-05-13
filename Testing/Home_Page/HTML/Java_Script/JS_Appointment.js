/* ============================================================
   APPOINTMENT SCHEDULER SHORTCUT
   Opens the appointment scheduler flyout directly from any
   CTA button on the page (e.g. "Book Now" in the welcome section).
   Exposed as a global so HTML onclick attributes can call it.
============================================================ */

function openAppointmentSchedulerFlyout() {
    var navItem = document.getElementById("scheduleAppointmentNavItem");
    var schedulerTrigger = document.getElementById("appointmentSchedulerFlyoutTrigger");

    if (!navItem || !schedulerTrigger) return;

    var dropdown = navItem.querySelector(".main-navigation__dropdown");
    var flyout = schedulerTrigger.querySelector(".main-navigation__flyout");

    if (!dropdown) return;

    navItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    var isDropdownOpen = dropdown.style.visibility === "visible" && dropdown.style.pointerEvents === "auto";
    if (!isDropdownOpen) {
        navItem.click();
    }

    window.setTimeout(function () {
        if (flyout && !flyout.classList.contains("is-open")) {
            schedulerTrigger.click();
        }

        window.setTimeout(function () {
            var firstField = document.querySelector(
                "#flyoutAppointmentForm input, #flyoutAppointmentForm select, #flyoutAppointmentForm textarea"
            );
            if (firstField && typeof firstField.focus === "function") {
                firstField.focus();
            }
        }, 60);
    }, 80);
}

// Expose globally for inline HTML onclick usage
window.openAppointmentSchedulerFlyout = openAppointmentSchedulerFlyout;
