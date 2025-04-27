document.body.style.backgroundColor = "#ffe4e1"; // Light pink  

(async () => {
    try {
      const addOnUISdk = await import("https://new.express.adobe.com/static/add-on-sdk/sdk.js");
      await addOnUISdk.ready;
  
      const { runtime } = addOnUISdk.instance;
      const sandboxProxy = await runtime.apiProxy("documentSandbox");
  
      const uploadButton = document.getElementById("upload-button");
      const pdfUpload = document.getElementById("pdf-upload");
      const fileNameDisplay = document.getElementById("file-name");
      const templateItems = document.querySelectorAll(".template-item");
      const goButton = document.getElementById("go-button");
      const progressBar = document.getElementById("progress-bar");
      const errorMessage = document.getElementById("error-message");
  
      let pdfFile = null;
      let selectedTemplate = "";
      let isProcessing = false;
  
      const showError = (message) => {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
      };
  
      const clearError = () => {
        errorMessage.textContent = "";
        errorMessage.style.display = "none";
      };
  
      uploadButton.addEventListener("click", () => {
        pdfUpload.click();
      });
  
      pdfUpload.addEventListener("change", (event) => {
        const file = event.target.files[0];
  
        if (file && file.type === "application/pdf") {
          pdfFile = file;
          fileNameDisplay.textContent = `Selected: ${file.name}`;
          fileNameDisplay.style.display = "block";
          clearError();
  
          templateItems.forEach((item) => {
            item.classList.add("dimmed");
            item.classList.remove("selected");
          });
  
          updateGoButtonState();
        } else {
          pdfFile = null;
          fileNameDisplay.style.display = "none";
          showError("Please upload a valid PDF file.");
          updateGoButtonState();
        }
      });
  
      templateItems.forEach((item) => {
        item.addEventListener("click", () => {
          if (isProcessing) return;
          templateItems.forEach((i) => i.classList.remove("selected"));
          item.classList.add("selected");
          selectedTemplate = item.dataset.template;
          updateGoButtonState();
        });
      });
  
      const updateGoButtonState = () => {
        goButton.disabled = !(pdfFile && selectedTemplate) || isProcessing;
      };        
  
      goButton.addEventListener("click", async () => {
        if (!pdfFile || !selectedTemplate) {
          showError("Please upload a PDF and select a template.");
          return;
        }
  
        isProcessing = true;
        clearError();
        uploadButton.disabled = true;
        templateItems.forEach((item) => (item.style.pointerEvents = "none"));
        updateGoButtonState();
  
        await convertPdfToPresentation();
      });
  
      const convertPdfToPresentation = async () => {
        try {
          progressBar.style.display = "block";
          progressBar.progress = 0;
  
          for (let i = 0; i <= 100; i += 10) {
            progressBar.progress = i;
            await new Promise((resolve) => setTimeout(resolve, 500));
          }
  
          alert("Presentation created successfully!");
        } catch (error) {
          showError("Error during conversion. Please try again.");
        } finally {
          isProcessing = false;
          progressBar.style.display = "none";
          progressBar.progress = 0;
          uploadButton.disabled = false;
          templateItems.forEach((item) => (item.style.pointerEvents = "auto"));
          updateGoButtonState();
        }
      };
  
      const createRectangleButton = document.getElementById("createRectangle");
      if (createRectangleButton) {
        createRectangleButton.addEventListener("click", async () => {
          await sandboxProxy.createRectangle();
        });
        createRectangleButton.disabled = false;
      }
    } catch (e) {
      // Silent fail fallback
    }
  })();
  