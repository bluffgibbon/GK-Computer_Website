/* ============================================================
   FLYOUT CALENDAR — Appointment Scheduler
   Mini calendar inside the Schedule an Appointment flyout.
   Renders month grid, marks available/booked days,
   and syncs selected date with the flyout form date input.
============================================================ */

function initFlyoutCalendar() {
    var monthLabel = document.getElementById("flyoutCalendarMonth");
    var daysGrid   = document.getElementById("flyoutCalendarDays");
    var prevBtn    = document.getElementById("flyoutPrevMonth");
    var nextBtn    = document.getElementById("flyoutNextMonth");
    var dateInput  = document.getElementById("flyoutAppointmentDate");
    var timeSelect = document.getElementById("flyoutAppointmentTime");

    if (!monthLabel || !daysGrid) return;

    var today = new Date();
    var currentMonth = today.getMonth();
    var currentYear  = today.getFullYear();

    /* ---------- sample booked dates (replace with real data) ---------- */
    var bookedDates = [];

    /* ---------- available time slots ---------- */
    var timeSlots = [
        "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
        "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
        "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
        "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
        "5:00 PM", "5:30 PM"
    ];

    function populateTimeSlots() {
        if (!timeSelect) return;
        timeSelect.innerHTML = '<option value="" disabled selected>Select a time</option>';
        timeSlots.forEach(function (slot) {
            var opt = document.createElement("option");
            opt.value = slot;
            opt.textContent = slot;
            timeSelect.appendChild(opt);
        });
    }

    function isBooked(year, month, day) {
        var dateStr = year + "-" +
            String(month + 1).padStart(2, "0") + "-" +
            String(day).padStart(2, "0");
        return bookedDates.indexOf(dateStr) !== -1;
    }

    function isPast(year, month, day) {
        var d = new Date(year, month, day);
        var t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        return d < t;
    }

    function renderMonth() {
        var monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        monthLabel.textContent = monthNames[currentMonth] + " " + currentYear;

        daysGrid.innerHTML = "";

        var firstDay   = new Date(currentYear, currentMonth, 1).getDay();
        var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        /* Empty cells before first day */
        for (var e = 0; e < firstDay; e++) {
            var empty = document.createElement("span");
            empty.className = "flyout-calendar__day flyout-calendar__day--empty";
            daysGrid.appendChild(empty);
        }

        /* Day cells */
        for (var d = 1; d <= daysInMonth; d++) {
            var cell = document.createElement("span");
            cell.className = "flyout-calendar__day";
            cell.textContent = d;

            if (isPast(currentYear, currentMonth, d)) {
                cell.classList.add("flyout-calendar__day--empty");
                cell.style.opacity = "0.3";
                cell.style.cursor = "default";
            } else if (isBooked(currentYear, currentMonth, d)) {
                cell.classList.add("flyout-calendar__day--booked");
            } else {
                cell.classList.add("flyout-calendar__day--available");
                (function (day) {
                    cell.addEventListener("click", function () {
                        selectDay(day, cell);
                    });
                })(d);
            }

            daysGrid.appendChild(cell);
        }
    }

    function selectDay(day, cell) {
        /* Remove previous selection */
        daysGrid.querySelectorAll(".flyout-calendar__day--selected").forEach(function (c) {
            c.classList.remove("flyout-calendar__day--selected");
        });
        cell.classList.add("flyout-calendar__day--selected");

        /* Sync date input */
        if (dateInput) {
            var dateStr = currentYear + "-" +
                String(currentMonth + 1).padStart(2, "0") + "-" +
                String(day).padStart(2, "0");
            dateInput.value = dateStr;
        }
    }

    /* ---------- navigation ---------- */
    if (prevBtn) {
        prevBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            currentMonth--;
            if (currentMonth < 0) { currentMonth = 11; currentYear--; }
            renderMonth();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener("click", function (e) {
            e.stopPropagation();
            currentMonth++;
            if (currentMonth > 11) { currentMonth = 0; currentYear++; }
            renderMonth();
        });
    }

    /* ---------- prevent form click from closing flyout ---------- */
    var form = document.getElementById("flyoutAppointmentForm");
    if (form) {
        form.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    /* Also prevent calendar clicks from closing flyout */
    var calendarContainer = daysGrid.closest(".flyout-appointment__calendar");
    if (calendarContainer) {
        calendarContainer.addEventListener("click", function (e) {
            e.stopPropagation();
        });
    }

    /* ---------- init ---------- */
    populateTimeSlots();
    renderMonth();
}
