import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

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

function createTitle(text) {
    const textNode = editor.createText();
    textNode.fullContent.text = text; // Set the text content first

    // Apply character styles including font size and color
    textNode.fullContent.applyCharacterStyles({
        fontSize: 50,
        color: colorUtils.fromHex("#E1A141") // Set the text color to a HEX value
    });

    const insertionParent = editor.context.insertionParent;
    textNode.setPositionInParent({ x: 100, y: 150 }, textNode.topLeftLocal);
    insertionParent.children.append(textNode);
}

function createBulletPoints(textArray) {
    for (let i = 0; i < textArray.length; i++) {
        const textNode = editor.createText();
        textNode.fullContent.text = textArray[i]; // Set the text content first

        // Apply character styles including font size and color
        textNode.fullContent.applyCharacterStyles({
            fontSize: 20,
            color: colorUtils.fromHex("#000000") // Set the text color to a HEX value
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
        // Create a rectangle geometry
        const rectangle = editor.createRectangle();
        rectangle.width = 800; // Set the width of the rectangle
        rectangle.height = 600; // Set the height of the rectangle

        // Create a new page using the rectangle as input
        const newPage = await editor.addPage({inputGeometry: rectangle});

        console.log('New page added:', newPage);

        // Navigate to the newly created page
        editor.context.currentPage = newPage;
        console.log('Navigated to new page:', newPage);
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
