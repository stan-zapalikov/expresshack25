import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils,fonts } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;



const placeholderTitle = "Title Placeholder";
const bulletsPlaceholder = [
    "Bullet 1 Placeholder",
    "Bullet 2 Placeholder",
    "Bullet 3 Placeholder"
];

let slidesData = {
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

const themes = {
    clarityMinimal: {
        titleSlide: {
            fontSize: 100,
            position: { x: 226, y: 287 },
            color: "#000000",
            width: 1500
        },
        sectionSlide: {
            fontSize: 90,
            position: { x: 793, y: 624 },
            color: "#000000",
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 80,
                position: { x: 416, y: 100 },
                color: "#000000",
                width: 1400
            },
            bullets: {
                fontSize: 34,
                position: { x: 101, yStart: 413, yStep: 30 },
                color: "#3D3D3D",
                width: 1200
            }
        }
    },
    midnightMinimal: {
        titleSlide: {
            fontSize: 70,
            position: { x: 400, y: 300 },
            color: "#FFFFFF",
            width: 1500
        },
        sectionSlide: {
            fontSize: 60,
            position: { x: 400, y: 300 },
            color: "#CCCCCC",
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 50,
                position: { x: 100, y: 100 },
                color: "#FFFFFF",
                width: 1400
            },
            bullets: {
                fontSize: 24,
                position: { x: 100, yStart: 200, yStep: 40 },
                color: "#AAAAAA",
                width: 1200
            }
        }
    },
    executiveSlate: {
        titleSlide: {
            fontSize: 68,
            position: { x: 400, y: 300 },
            color: "#1C1C1C",
            width: 1500
        },
        sectionSlide: {
            fontSize: 58,
            position: { x: 400, y: 300 },
            color: "#2F2F2F",
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 48,
                position: { x: 90, y: 120 },
                color: "#222222",
                width: 1400
            },
            bullets: {
                fontSize: 22,
                position: { x: 90, yStart: 220, yStep: 35 },
                color: "#333333",
                width: 1200
            }
        }
    },
    brightPop: {
        titleSlide: {
            fontSize: 72,
            position: { x: 400, y: 300 },
            color: "#FF5733",
            width: 1500
        },
        sectionSlide: {
            fontSize: 62,
            position: { x: 400, y: 300 },
            color: "#FF8C42",
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 52,
                position: { x: 110, y: 120 },
                color: "#FF5733",
                width: 1400
            },
            bullets: {
                fontSize: 26,
                position: { x: 110, yStart: 230, yStep: 38 },
                color: "#C70039",
                width: 1200
            }
        }
    }
};

// THEME SELECTION
const selectedTheme = themes.clarityMinimal; // Change this to switch themes

function createTitle(text, slideType) {
    const textNode = editor.createText();
    textNode.fullContent.text = text; // Set the text content first

    let slideSettings;
    if (slideType === "title") {
        slideSettings = selectedTheme.titleSlide;
    } else if (slideType === "section") {
        slideSettings = selectedTheme.sectionSlide;
    } else if (slideType === "body") {
        slideSettings = selectedTheme.bodySlide.heading;
    } else {
        console.error("Invalid slide type provided: ", slideType);
        return;
    }

    // Apply character styles including font, size, and color
    textNode.fullContent.applyCharacterStyles({
        fontSize: slideSettings.fontSize,
        color: colorUtils.fromHex(slideSettings.color) // Set the text color to a HEX value
    });

    const insertionParent = editor.context.insertionParent;
    textNode.setPositionInParent({ 
        x: slideSettings.position.x, 
        y: slideSettings.position.y 
    }, textNode.topLeftLocal);
    insertionParent.children.append(textNode);
    console.log("Text Node Added: ", textNode);
}

function createBulletPoints(textArray) {
    for (let i = 0; i < textArray.length; i++) {
        const textNode = editor.createText();
        textNode.fullContent.text = textArray[i]; // Set the text content first

        // Apply character styles including font size and color
        textNode.fullContent.applyCharacterStyles({
            fontSize: selectedTheme.bodySlide.bullets.fontSize,
            color: colorUtils.fromHex(selectedTheme.bodySlide.bullets.color) // Set the text color to a HEX value
        });

        const insertionParent = editor.context.insertionParent;
        textNode.setPositionInParent({ 
            x: selectedTheme.bodySlide.bullets.position.x, 
            y: selectedTheme.bodySlide.bullets.position.yStart + (i * selectedTheme.bodySlide.bullets.position.yStep) 
        }, textNode.topLeftLocal);
        insertionParent.children.append(textNode);
    }
}

function createSlide(text, bullets) {
    createTitle(text);
    createBulletPoints(bullets);
}

// sandbox/code.js






async function createSlides() {
    try {
        // First create a title slide
        editor.documentRoot.pages.addPage({
            height: 1080,
            width: 1920
        });
        console.log('Created title page');
        createTitle(slidesData.title, "title"); // Specify slide type as "title"
        
        // Now loop through all sections and slides
        for (const section of slidesData.sections) {
            for (const slide of section.slides) {
                editor.documentRoot.pages.addPage({
                    height: 1080,
                    width: 1920
                });
                console.log(`Created page for: ${slide.slide_title}`);
          
                createTitle(slide.slide_title, slide.slide_type); // Use slide_type to determine settings
                createBulletPoints(slide.bullet_points || []);
            }
        }
    } catch (error) {
        console.error('Error adding new page:', error);
    }
}

function start() {
    const sandboxApi = {
        generatePresentation: (newSlidesData) => {
            slidesData = newSlidesData;
            createSlides();
        }
    };
    runtime.exposeApi(sandboxApi);
}

start();
