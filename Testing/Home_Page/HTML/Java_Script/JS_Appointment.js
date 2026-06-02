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

    // Dropdowns are moved to document.body by JS_Navigation — find them there
    var dropdown = document.body.querySelector(".main-navigation__dropdown") || navItem.querySelector(".main-navigation__dropdown");

    if (!dropdown) return;

    navItem.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });

    var isDropdownOpen = dropdown.style.visibility === "visible" && dropdown.style.pointerEvents === "auto";
    if (!isDropdownOpen) {
        navItem.click();
    }

    // Wait for dropdown open animation, then click the flyout trigger directly
    window.setTimeout(function () {
        schedulerTrigger.click();

        window.setTimeout(function () {
            var firstField = document.querySelector(
                "#flyoutAppointmentForm input, #flyoutAppointmentForm select, #flyoutAppointmentForm textarea"
            );
            if (firstField && typeof firstField.focus === "function") {
                firstField.focus();
            }
        }, 60);
    }, 150);
}

// Expose globally for inline HTML onclick usage
window.openAppointmentSchedulerFlyout = openAppointmentSchedulerFlyout;
