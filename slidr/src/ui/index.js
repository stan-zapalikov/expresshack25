import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";
import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID,PEXELS_API_KEY} from "./env.js";

const slidesData = {
    "title": "Historical Changes in East Asia's Social and Economic Landscapes",
    "sections": [
        {
            "section_title": "Economic Transformations",
            "slides": [
                {
                    "slide_type": "section",
                    "slide_title": "Economic Transformations",
                    "bullet_points": [],
                    "accompanyingImageDescription": "markets, merchants, trade, agriculture, currency"
                },
                {
                    "slide_type": "body",
                    "slide_title": "Agricultural Changes",
                    "bullet_points": [
                        "New agricultural techniques increased yields",
                        "Uniform Land Tax Law introduced after tax records were lost",
                        "Tax payments could be made in rice, coin, or cotton"
                    ],
                    "accompanyingImageDescription": "rice fields, cotton plants, farmers working"
                }
            ]
        },
        {
            "section_title": "Societal Shifts",
            "slides": [
                {
                    "slide_type": "section",
                    "slide_title": "Societal Shifts",
                    "bullet_points": [],
                    "accompanyingImageDescription": "social gatherings, diverse community, educational settings"
                },
                {
                    "slide_type": "body",
                    "slide_title": "Gender Roles and Education",
                    "bullet_points": [
                        "Women had roles in farming and business",
                        "Separate educational paths for boys and girls",
                        "Elite women learned Confucian ethics and poetry"
                    ],
                    "accompanyingImageDescription": "school scenes, male and female students, books"
                }
            ]
        }
    ]
};

export async function searchPexels(query) {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=medium`;


    try {
        const response = await fetch(url, {
            headers: {
                Authorization: PEXELS_API_KEY
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
            return data.photos[0].src.original;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error fetching from Pexels:', error);
        return null;
    }
}

async function fetchImageAsBase64(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
async function fetchImageAsBlob(imageUrl) {
    const response = await fetch(imageUrl);
    return await response.blob();
}

async function enrichSlidesWithImages(slidesOutline) {
    for (const section of slidesOutline.sections) {
        for (const slide of section.slides) {
            if (slide.accompanyingImageDescription && slide.accompanyingImageDescription.trim() !== "") {
                const imageUrl = await searchPexels(slide.accompanyingImageDescription);
                if (imageUrl) {
                    try {
                        const blob = await fetchImageAsBlob(imageUrl);
                        slide.accompanyingImageBlob = blob;   // 🔥 store the Blob directly
                        console.log(`Fetched blob image for "${slide.slide_title}"`);
                    } catch (e) {
                        console.warn(`Failed to fetch image for "${slide.slide_title}"`, e);
                    }
                } else {
                    console.warn(`No image found for "${slide.slide_title}".`);
                }
            }
        }
    }
}





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
         uploadInput.style.display = 'none';
    document.querySelector('.template-grid').style.display = 'none';
    addImagesCheckbox.parentElement.style.display = 'none';
    goButton.style.display = 'none';
    document.getElementById('uploadButton').style.display = 'none';
    document.getElementById('file-name').style.display = 'none';
    document.getElementById('subtext').style.display = 'none';
    document.getElementById('addImagesLabel').style.display = 'none';

    // Show loading gif
    loadingGif.style.display = 'block';
        //document.getElementById('main-screen').style.display = 'none'; 
        
        
    
        try {
            const fileId = await uploadFileToOpenAI(rawUpload);
            const outline = await generateOutline(fileId);
            
    
            //const outline = slidesData; // Using static test data for now
            console.log("Generated Outline:", outline);
            await enrichSlidesWithImages(outline);  // <- block here, wait for all image urls to be added

            console.log("Generated Outline with images:", outline);
            await sandboxProxy.generatePresentation(outline, themeUsed, addImages);
            showOutline(outline)
        } catch (error) {
            console.error("Error generating outline:", error);
        }
        
    });
    
    

    goButton.disabled = true;
});
