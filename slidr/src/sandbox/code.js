import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils,fonts } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

const placeholderTitle = "Title Placeholder";
const bulletsPlaceholder = [
    "Bullet 1 Placeholder",
    "Bullet 2 Placeholder",
    "Bullet 3 Placeholder"
];

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

async function createTitle(text) {
    const textNode = editor.createText();
    textNode.fullContent.text = text; // Set the text content first

    // Get the font object for Adobe Garamond Pro


    // Apply character styles including font, size, and color
    textNode.fullContent.applyCharacterStyles({
        fontSize: 97,
        color: colorUtils.fromHex("#000000")
    });

    const insertionParent = editor.context.insertionParent;
    textNode.setPositionInParent({ x: 100, y: 150 }, textNode.topLeftLocal);
    insertionParent.children.append(textNode);
    console.log("Text Node Added: ", textNode);
}

function createBulletPoints(textArray) {
    for (let i = 0; i < textArray.length; i++) {
        const textNode = editor.createText();
        textNode.fullContent.text = textArray[i]; // Set the text content first

        // Apply character styles including font size and color
        textNode.fullContent.applyCharacterStyles({
            fontSize: 34,
            color: colorUtils.fromHex("#3D3D3D") // Set the text color to a HEX value
        });

        const insertionParent = editor.context.insertionParent;
        textNode.setPositionInParent({ x: 100, y: 200 + (i * 30) }, textNode.topLeftLocal);
        insertionParent.children.append(textNode);
    }
}

function createSlide(text, bullets) {
    createTitle(text);
    createBulletPoints(bullets);
}

async function createSlides() {
    try {
        // First create a title slide
        editor.documentRoot.pages.addPage({
            height: 1080,
            width: 1920
        });
        console.log('Created title page');
        createSlide(slidesData.title, []); // Only title, no bullets on first slide

        // Now loop through all sections and slides
        for (const section of slidesData.sections) {
            for (const slide of section.slides) {
                editor.documentRoot.pages.addPage({
                    height: 1080,
                    width: 1920
                });
                console.log(`Created page for: ${slide.slide_title}`);
                createSlide(slide.slide_title, slide.bullet_points || []);
            }
        }
    } catch (error) {
        console.error('Error adding new page:', error);
    }
}

function start() {
    const sandboxApi = {
        
        generatePresentation: () => {createSlides()}
    };

    runtime.exposeApi(sandboxApi);
}

start();
