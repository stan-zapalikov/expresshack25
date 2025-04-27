import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils,fonts,constants } from "express-document-sdk";

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

function insertLineBreak(text) {
    const words = text.split(' ');
    const midIndex = Math.floor(words.length / 2);
    // Join the first half and second half with a line break
    const firstHalf = words.slice(0, midIndex).join(' ');
    const secondHalf = words.slice(midIndex).join(' ');
    return `${firstHalf}\n${secondHalf}`;
}

const themes = {
    clarityMinimal: {
        backgroundColor: "#FFFFFF",
        font: "AGaramondPro-Regular",
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
                position: { x: 300, yStart: 413, yStep: 90 },
                color: "#3D3D3D",
                width: 1200
            }
        }
    },
    midnightMinimal: {
        backgroundColor: "#181A1B",
        titleSlide: {
            fontSize: 100,
            position: { x: 226, y: 287 },
            color: "#FFFFFF", // white for dark mode
            width: 1500
        },
        sectionSlide: {
            fontSize: 90,
            position: { x: 793, y: 624 },
            color: "#FFFFFF", // white for dark mode
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 80,
                position: { x: 416, y: 100 },
                color: "#FFFFFF", // white for dark mode
                width: 1400
            },
            bullets: {
                fontSize: 34,
                position: { x: 300, yStart: 413, yStep: 90 },
                color: "#CCCCCC", // light gray for dark mode
                width: 1200
            }
        }
    },
    executiveSlate: {
        backgroundColor: "#232946", // deep blue
        titleSlide: {
            fontSize: 100,
            position: { x: 226, y: 287 },
            color: "#F4D35E", // gold
            width: 1500
        },
        sectionSlide: {
            fontSize: 90,
            position: { x: 793, y: 624 },
            color: "#F4D35E", // gold
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 80,
                position: { x: 416, y: 100 },
                color: "#F4D35E", // gold
                width: 1400
            },
            bullets: {
                fontSize: 34,
                position: { x: 300, yStart: 413, yStep: 90 },
                color: "#E7ECEF", // light blue-gray
                width: 1200
            }
        }
    },
    brightPop: {
        backgroundColor: "#FFF6F0", // light peach
        titleSlide: {
            fontSize: 100,
            position: { x: 226, y: 287 },
            color: "#FF5733", // bright orange-red
            width: 1500
        },
        sectionSlide: {
            fontSize: 90,
            position: { x: 793, y: 624 },
            color: "#FF8C42", // orange
            width: 1500
        },
        bodySlide: {
            heading: {
                fontSize: 80,
                position: { x: 416, y: 100 },
                color: "#FF5733", // bright orange-red
                width: 1400
            },
            bullets: {
                fontSize: 34,
                position: { x: 300, yStart: 413, yStep: 90 },
                color: "#C70039", // magenta
                width: 1200
            }
        }
    }
};

// THEME SELECTION
let selectedTheme = themes.clarityMinimal; // Default theme

// Listen for theme selection event from UI
if (typeof window !== 'undefined') {
    window.addEventListener('selectedThemeChanged', (event) => {
        const themeKey = event.detail.selectedTheme;
        if (themes[themeKey]) {
            selectedTheme = themes[themeKey];
            console.log('Theme changed to:', themeKey);
        }
    });
}

function createTitle(text, slideType) {
    const textNode = editor.createText();
    textNode.fullContent.text = insertLineBreak(text); // Set the text content first

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

    // Apply font for clarityMinimal
    if (selectedTheme.font) {
        fonts.fromPostscriptName(selectedTheme.font).then(font => {
            if (font) {
                textNode.fullContent.applyCharacterStyles({ font: font });
            }
        });
    }

    textNode.fullContent.applyCharacterStyles({
        fontSize: slideSettings.fontSize,
        color: colorUtils.fromHex(slideSettings.color)
    });

    // Center text for section slides
    if (slideType === "section") {
        textNode.fullContent.paragraphStyle = {
            alignment: "center"
        };
    }

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
        // Create the text node
        const textNode = editor.createText();
        textNode.fullContent.text = textArray[i];
        textNode.fullContent.applyCharacterStyles({
            fontSize: selectedTheme.bodySlide.bullets.fontSize,
            color: colorUtils.fromHex(selectedTheme.bodySlide.bullets.color)
        });
        const x = selectedTheme.bodySlide.bullets.position.x;
        const y = selectedTheme.bodySlide.bullets.position.yStart + (i * selectedTheme.bodySlide.bullets.position.yStep);
        textNode.setPositionInParent({ x: x + 40, y: y }, textNode.topLeftLocal); // Text stays in the same place

        // Create the bullet point circle (ellipse)
        const circle = editor.createEllipse();
        const circleRadius = 10; // You can adjust the bullet size here
        circle.rx = circleRadius;
        circle.ry = circleRadius;
        circle.fill = editor.makeColorFill(colorUtils.fromHex(selectedTheme.bodySlide.bullets.color));
        circle.setPositionInParent({ x: x - 150, y: (y + selectedTheme.bodySlide.bullets.fontSize / 2) - 10 }, { x: 0, y: 0 }); // Only the circle moves back

        // Append both nodes to the current insertion parent
        editor.context.insertionParent.children.append(circle, textNode);
    }
}

function setArtboardBackgroundColor(artboard, hexColor) {
    if (!artboard) {
        console.error("No artboard found to set background color.");
        return;
    }
    const backgroundRectangle = editor.createRectangle();
    backgroundRectangle.width = artboard.boundsLocal.width;
    backgroundRectangle.height = artboard.boundsLocal.height;
    backgroundRectangle.fill = editor.makeColorFill(colorUtils.fromHex(hexColor));
    backgroundRectangle.translation = { x: 0, y: 0 };
    artboard.children.append(backgroundRectangle);
}

function createSlide(text, bullets) {
    createTitle(text);
    createBulletPoints(bullets);
}

// sandbox/code.js






async function createSlides() {
    try {
        // First create a title slide
        const titlePage = editor.documentRoot.pages.addPage({
            height: 1080,
            width: 1920
        });
        let titleArtboard = titlePage.artboards[0];
        if (!titleArtboard) {
            titleArtboard = titlePage.artboards.addArtboard();
        }
        setArtboardBackgroundColor(titleArtboard, selectedTheme.backgroundColor);
        createTitle(slidesData.title, "title");

        // Now loop through all sections and slides
        for (const section of slidesData.sections) {
            for (const slide of section.slides) {
                const newPage = editor.documentRoot.pages.addPage({
                    height: 1080,
                    width: 1920
                });
                let artboard = newPage.artboards[0];
                if (!artboard) {
                    artboard = newPage.artboards.addArtboard();
                }
                setArtboardBackgroundColor(artboard, selectedTheme.backgroundColor);
                createTitle(slide.slide_title, slide.slide_type);
                createBulletPoints(slide.bullet_points || []);
            }
        }
    } catch (error) {
        console.error('Error adding new page:', error);
    }
}

function start() {
    const sandboxApi = {
        generatePresentation: (newSlidesData, themeKey, addImages) => {
            slidesData = newSlidesData;
            if (themeKey && themes[themeKey]) {
                selectedTheme = themes[themeKey];
                console.log('Theme set from UI:', themeKey);
            }
            createSlides();
        }
    };
    runtime.exposeApi(sandboxApi);
}

start();
