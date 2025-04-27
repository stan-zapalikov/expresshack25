(async () => {
  try {
    const sdk = await import("https://new.express.adobe.com/static/add-on-sdk/sdk.js");
    await sdk.ready;

    const { runtime } = sdk.instance;
    const sandbox = await runtime.apiProxy("documentSandbox");

    const $ = (id) => document.getElementById(id);
    const uploadBtn = $("upload-button");
    const pdfInput = $("pdf-upload");
    const fileName = $("file-name");
    const templateItems = document.querySelectorAll(".template-item");
    const goBtn = $("go-button");
    const progress = $("progress-bar");
    const error = $("error-message");
    goBtn.addEventListener("click",console.log("bruh"))
    let pdfFile = null, selectedTemplate = "", isProcessing = false;

    const showError = (msg) => { error.textContent = msg; error.style.display = "block"; };
    const clearError = () => { error.textContent = ""; error.style.display = "none"; };
    const updateGoBtn = () => { goBtn.disabled = !(pdfFile && selectedTemplate) || isProcessing; };

    uploadBtn.onclick = () => pdfInput.click();

    pdfInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file?.type === "application/pdf") {
        pdfFile = file;
        fileName.textContent = `Selected: ${file.name}`;
        fileName.style.display = "block";
        clearError();
      } else {
        pdfFile = null;
        fileName.style.display = "none";
        showError("Please upload a valid PDF file.");
      }
      updateGoBtn();
    };

    templateItems.forEach((item) => {
      item.onclick = () => {
        if (isProcessing) return;
        templateItems.forEach((i) => {
          i.classList.remove("selected");
          i.querySelector(".clicked-label")?.style.setProperty("display", "none");
        });
        item.classList.add("selected");
        item.querySelector(".clicked-label")?.style.setProperty("display", "inline");
        selectedTemplate = item.dataset.template;
        updateGoBtn();
      };
    });

    goBtn.onclick = async () => {
      if (!pdfFile || !selectedTemplate) return showError("Please upload a PDF and select a template.");

      isProcessing = true;
      clearError();
      uploadBtn.disabled = true;
      updateGoBtn();
      await convert();
    };

    const convert = async () => {
      try {
        progress.style.display = "block";
        for (let i = 0; i <= 100; i += 10) {
          progress.progress = i;
          await new Promise((r) => setTimeout(r, 300));
        }
        alert("Presentation created successfully!");
      } catch {
        showError("Error during conversion. Please try again.");
      } finally {
        isProcessing = false;
        progress.style.display = "none";
        progress.progress = 0;
        uploadBtn.disabled = false;
        updateGoBtn();
      }
    };
    
   
  } catch {}
})();
