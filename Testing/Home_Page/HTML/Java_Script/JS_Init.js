/* ============================================================
   BOOTSTRAP â€” COMPONENT LOADING & INITIALIZATION
   Loads all HTML components in sequence and wires up each
   module's init function via loadComponent() callbacks.
   Must be the last script loaded.
============================================================ */

document.addEventListener("DOMContentLoaded", function () {

    loadComponent("Components-00_Top_Banner",
        "HTML/Components/00_Top_Banner.html");

    loadComponent("Components-01_Header_Brand_Bar",
        "HTML/Components/01_Header_Brand_Bar.html",
        initLogoLightbox);

    /* Nav shell loads first, then the 6 dropdown-group sub-files
       are appended in order into .main-navigation__list before
       initNavigation() fires. */
    loadComponent("Components-02_Main_Navigation_Bar",
        "HTML/Components/02_Main_Navigation_Bar/02_Main_Navigation_Bar.html",
        function () {
            loadSubComponents(".main-navigation__list", [
                "HTML/Components/02_Main_Navigation_Bar/02a_Nav_About.html",
                "HTML/Components/02_Main_Navigation_Bar/02b_Nav_Terms.html",
                "HTML/Components/02_Main_Navigation_Bar/02c_Nav_Privacy.html",
                "HTML/Components/02_Main_Navigation_Bar/02d_Nav_Schedule.html",
                "HTML/Components/02_Main_Navigation_Bar/02e_Nav_Payment.html",
                "HTML/Components/02_Main_Navigation_Bar/02f_Nav_Support.html"
            ], function () {
                initNavigation();
                if (typeof initFlyouts === "function") initFlyouts();
                if (typeof initFlyoutCalendar === "function") initFlyoutCalendar();
            });
        });

    initSmoothScroll();

    loadComponent("Components-02B_Table_Of_Contents",
        "HTML/Components/02_Main_Navigation_Bar/02B_Table_Of_Contents.html");

    loadComponent("Components-03_Section_Welcome",
        "HTML/Components/03_Section_Welcome.html");

    loadComponent("Components-04_Section_Why_Choose_Us",
        "HTML/Components/04_Section_Why_Choose_Us.html",
        function () { initWhyChooseUsCards(); initGenericModal(); });

    loadComponent("Components-05_Section_Services",
        "HTML/Components/05_Section_Services.html");

    loadComponent("Components-06_Footer",
        "HTML/Components/06_Footer.html");

    /* Side menu shell loads first, then the 13 service flyout
       sub-files are appended in order into #sideMenu ul before
       initSideMenu() fires. */
    loadComponent("Components-07_Side_Menu_Services",
        "HTML/Components/07_Side_Menu_Services/07_Side_Menu_Services.html",
        function () {
            loadSubComponents("#sideMenu ul", [
                "HTML/Components/07_Side_Menu_Services/07a_Service_Computer_Repair.html",
                "HTML/Components/07_Side_Menu_Services/07b_Service_Laptop.html",
                "HTML/Components/07_Side_Menu_Services/07c_Service_Software.html",
                "HTML/Components/07_Side_Menu_Services/07d_Service_Custom_PC.html",
                "HTML/Components/07_Side_Menu_Services/07e_Service_Networking.html",
                "HTML/Components/07_Side_Menu_Services/07f_Service_Website.html",
                "HTML/Components/07_Side_Menu_Services/07g_Service_Data_Recovery.html",
                "HTML/Components/07_Side_Menu_Services/07h_Service_Virus.html",
                "HTML/Components/07_Side_Menu_Services/07i_Service_IT_Consulting.html",
                "HTML/Components/07_Side_Menu_Services/07j_Service_Elder_Tech.html",
                "HTML/Components/07_Side_Menu_Services/07k_Service_Mobile.html",
                "HTML/Components/07_Side_Menu_Services/07l_Service_AI.html",
                "HTML/Components/07_Side_Menu_Services/07m_Service_Ewaste.html"
            ], function () {
                initSideMenu();
                initSideMenuFlyouts();
                // service card clicks now handled by initGenericModal()
            });
        });

    loadComponent("Components-08_Scroll_Buttons",
        "HTML/Components/08_Scroll_Buttons.html",
        initScrollButtons);
});
