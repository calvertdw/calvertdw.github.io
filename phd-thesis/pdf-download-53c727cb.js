window.THESIS_PDF_HREF = "20260604_Calvert_ASystemForFastResilientAndAdaptableLocoManipulationBehaviorsOnHumanoidRobots.pdf";

(function () {
    const ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 64C0 28.7 28.7 0 64 0H224V128c0 17.7 14.3 32 32 32H384V304H176c-35.3 0-64 28.7-64 64V512H64c-35.3 0-64-28.7-64-64V64zm384 64H256V0L384 128zM176 352V512H512V416c0-35.3-28.7-64-64-64H176z"/></svg>`;

    function insertPdfDownloadButton() {
        if (!window.THESIS_PDF_HREF) {
            return;
        }
        const rightButtons = document.querySelector("#mdbook-menu-bar .right-buttons");
        if (!rightButtons || document.getElementById('pdf-download-button')) {
            return;
        }

        const link = document.createElement("a");
        link.href = window.THESIS_PDF_HREF;
        link.title = "Download thesis PDF";
        link.setAttribute("aria-label", "Download thesis PDF");
        link.setAttribute("download", "");

        const icon = document.createElement("span");
        icon.className = "fa-svg";
        icon.id = "pdf-download-button";
        icon.innerHTML = ICON_SVG;
        link.appendChild(icon);

        const printLink = rightButtons.querySelector('a[href="print.html"]');
        if (printLink) {
            rightButtons.insertBefore(link, printLink);
        } else {
            rightButtons.appendChild(link);
        }
    }

    document.addEventListener("DOMContentLoaded", insertPdfDownloadButton);
})();
