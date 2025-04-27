import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");

    // Get the UI runtime
    const { runtime } = addOnUISdk.instance;

    // Get the sandbox proxy to call Document Sandbox APIs (code.js)
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    // Grab important elements
    const goButton = document.getElementById("goButton");
    const uploadInput = document.getElementById("pdf-upload");
    const addImagesCheckbox = document.getElementById("addImages");
    const loadingGif = document.getElementById("loading");

    // Variables to track user input
    let rawUpload = null;
    let addImages = false;
    let themeUsed = null;

    // Initially hide the loading gif
    loadingGif.style.display = 'none';

    // Set up file upload tracking
    uploadInput.addEventListener("change", (event) => {
        rawUpload = event.target.files[0];
        console.log("File uploaded:", rawUpload);

        // (Optional) enable button if file is uploaded
        if (rawUpload && themeUsed) {
            goButton.disabled = false;
        }
    });

    // Track template selection via a custom event
    window.addEventListener("selectedThemeChanged", (event) => {
        themeUsed = event.detail.selectedTheme;
        console.log("Theme selected:", themeUsed);

        // (Optional) enable button if theme is selected and file exists
        if (rawUpload && themeUsed) {
            goButton.disabled = false;
        }
    });

    // Track Add Images checkbox
    addImagesCheckbox.addEventListener("change", (event) => {
        addImages = event.target.checked;
        console.log("Add Images:", addImages);
    });

    // Handle Convert button click
    goButton.addEventListener("click", async (event) => {
        console.log("Clicked Convert!");

        // Show loading gif
        loadingGif.style.display = 'block';

        console.log("Preparing upload...");
        console.log("File to upload:", rawUpload);
        console.log("Theme used:", themeUsed);
        console.log("Add images:", addImages);

        // (Fake small wait to show loading effect)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Call your sandbox function (replace with your actual function)
        await sandboxProxy.createFinalSlides();

        // Hide loading gif once done (optional — or leave visible if still processing)
        loadingGif.style.display = 'none';
    });

    // Make sure button starts disabled until ready
    goButton.disabled = true;
});
