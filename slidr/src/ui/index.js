import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from "./env.js";

addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");

    const { runtime } = addOnUISdk.instance;
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    const goButton = document.getElementById("goButton");
    const uploadInput = document.getElementById("pdf-upload");
    const addImagesCheckbox = document.getElementById("addImages");
    const loadingGif = document.getElementById("loading");

    let rawUpload = null;
    let addImages = false;
    let themeUsed = null;

    loadingGif.style.display = 'none';

    uploadInput.addEventListener("change", (event) => {
        rawUpload = event.target.files[0];
        console.log("File uploaded:", rawUpload);

        if (rawUpload && themeUsed) {
            goButton.disabled = false;
        }
    });

    window.addEventListener("selectedThemeChanged", (event) => {
        themeUsed = event.detail.selectedTheme;
        console.log("Theme selected:", themeUsed);

        if (rawUpload && themeUsed) {
            goButton.disabled = false;
        }
    });

    addImagesCheckbox.addEventListener("change", (event) => {
        addImages = event.target.checked;
        console.log("Add Images:", addImages);
    });

    async function uploadFileToOpenAI(file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("purpose", "assistants");

        const response = await fetch("https://api.openai.com/v1/files", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: formData
        });

        const data = await response.json();
        if (!data.id) throw new Error("File upload failed");

        console.log("Uploaded file ID:", data.id);

        await waitUntilFileProcessed(data.id);

        return data.id;
    }

    async function waitUntilFileProcessed(fileId) {
        async function poll() {
            const response = await fetch(`https://api.openai.com/v1/files/${fileId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`
                }
            });

            const fileData = await response.json();
            console.log("File status:", fileData.status);

            if (fileData.status === "processed") {
                return;
            } else if (fileData.status === "processing") {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return poll();
            } else {
                throw new Error(`File processing failed: ${fileData.status}`);
            }
        }

        return poll();
    }

    async function generateOutline(fileId) {
        // 1. Create thread
        const threadResponse = await fetch("https://api.openai.com/v1/threads", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({})
        });
        const threadData = await threadResponse.json();
        const threadId = threadData.id;

        // 2. Post message with attachment
        const messagePayload = {
            role: "user",
            content: [
                { type: "text", text: "Please create a presentation outline from the attached document." }
            ],
            attachments: [
                {
                    file_id: fileId,
                    tools: [{ type: "file_search" }]
                }
            ]
        };

        await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify(messagePayload)
        });

        // 3. Run Assistant
        const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json",
                "OpenAI-Beta": "assistants=v2"
            },
            body: JSON.stringify({
                assistant_id: OPENAI_ASSISTANT_ID
            })
        });
        const runData = await runResponse.json();
        const runId = runData.id;

        // 4. Poll run status
        async function pollRunStatus() {
            const pollResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "OpenAI-Beta": "assistants=v2"
                }
            });
            const pollData = await pollResponse.json();
            console.log("Run status:", pollData.status);

            if (pollData.status === "completed") {
                return;
            } else if (pollData.status === "queued" || pollData.status === "in_progress") {
                await new Promise(resolve => setTimeout(resolve, 2000));
                return pollRunStatus();
            } else {
                throw new Error("Run did not complete successfully: " + pollData.status);
            }
        }

        await pollRunStatus();

        // 5. Fetch assistant message
        const finalResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "OpenAI-Beta": "assistants=v2"
            }
        });
        const finalData = await finalResponse.json();
        const assistantMessage = finalData.data.find(m => m.role === "assistant");

        if (!assistantMessage) {
            throw new Error("No assistant response received.");
        }

        const rawText = assistantMessage.content[0].text.value;
        return JSON.parse(rawText);
    }

    goButton.addEventListener("click", async (event) => {
        console.log("Clicked Convert!");

        document.querySelectorAll('body > *:not(#loading)').forEach(element => {
            element.style.display = 'none';
        });
        loadingGif.style.display = 'block';

        try {
            const fileId = await uploadFileToOpenAI(rawUpload);
            const outline = await generateOutline(fileId);

            console.log("Generated Outline:", outline);

            await sandboxProxy.generatePresentation(outline, themeUsed, addImages);
        } catch (error) {
            console.error("Error generating outline:", error);
        }
    });

    goButton.disabled = true;
});
