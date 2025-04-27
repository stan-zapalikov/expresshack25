import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

const themes = {
    clarityMinimal: {
        fontSize: {
            title: 50,
            heading: 30,
            bullet: 20,
        },
        color: {
            title: { red: 0, green: 0, blue: 0, alpha: 1 },         // Black
            heading: { red: 0.2, green: 0.2, blue: 0.2, alpha: 1 }, // Dark grey
            bullet: { red: 0.4, green: 0.4, blue: 0.4, alpha: 1 },  // Medium grey
        },
        spacing: {
            titleTopMargin: 100,
            bulletSpacing: 40,
        },
    },

    midnightMinimal: {
        fontSize: {
            title: 50,
            heading: 30,
            bullet: 20,
        },
        color: {
            title: { red: 1, green: 1, blue: 1, alpha: 1 },            // White
            heading: { red: 0.8, green: 0.8, blue: 0.8, alpha: 1 },    // Light grey
            bullet: { red: 0.6, green: 0.6, blue: 0.6, alpha: 1 },     // Dim grey
        },
        spacing: {
            titleTopMargin: 100,
            bulletSpacing: 40,
        },
        backgroundColor: { red: 0.1, green: 0.1, blue: 0.1, alpha: 1 }, // Almost black
    },

    executiveSlate: {
        fontSize: {
            title: 48,
            heading: 32,
            bullet: 22,
        },
        color: {
            title: { red: 0.15, green: 0.15, blue: 0.2, alpha: 1 },    // Slate dark
            heading: { red: 0.3, green: 0.3, blue: 0.4, alpha: 1 },    // Slate medium
            bullet: { red: 0.5, green: 0.5, blue: 0.6, alpha: 1 },     // Slate light
        },
        spacing: {
            titleTopMargin: 90,
            bulletSpacing: 35,
        },
        backgroundColor: { red: 0.9, green: 0.92, blue: 0.95, alpha: 1 }, // Soft white
    },

    brightPop: {
        fontSize: {
            title: 60,
            heading: 40,
            bullet: 25,
        },
        color: {
            title: { red: 1, green: 0.3, blue: 0.4, alpha: 1 },        // Bright red-pink
            heading: { red: 0.2, green: 0.6, blue: 1, alpha: 1 },      // Sky blue
            bullet: { red: 0.5, green: 0.8, blue: 0.3, alpha: 1 },     // Lime green
        },
        spacing: {
            titleTopMargin: 120,
            bulletSpacing: 50,
        },
        backgroundColor: { red: 1, green: 1, blue: 1, alpha: 1 }, // Pure white
    },
};

function createTitle(text, theme) {
    const textNode = editor.createText();
    textNode.fullContent.text = text;
    textNode.fullContent.applyCharacterStyles({ fontSize: theme.fontSize.title });

    const insertionParent = editor.context.insertionParent;
    textNode.fill = editor.makeColorFill(theme.color.title);

    textNode.setPositionInParent({ x: 50, y: theme.spacing.titleTopMargin }, textNode.topLeftLocal);
    insertionParent.children.append(textNode);
}

function createBulletPoints(points, theme) {
    const insertionParent = editor.context.insertionParent;
    let y = 200; // Start lower than the title

    points.forEach((point, index) => {
        const bullet = editor.createText();
        bullet.fullContent.text = `• ${point}`;
        bullet.fullContent.applyCharacterStyles({ fontSize: theme.fontSize.bullet });
        bullet.fill = editor.makeColorFill(theme.color.bullet);

        bullet.setPositionInParent({ x: 80, y: y + index * theme.spacing.bulletSpacing }, bullet.topLeftLocal);
        insertionParent.children.append(bullet);
    });
}





function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
        createRectangle: () => {
            const rectangle = editor.createRectangle();

            // Define rectangle dimensions.
            rectangle.width = 240;
            rectangle.height = 180;

            // Define rectangle position.
            rectangle.translation = { x: 10, y: 10 };

            // Define rectangle color.
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };

            // Fill the rectangle with the color.
            const rectangleFill = editor.makeColorFill(color);
            rectangle.fill = rectangleFill;

            // Add the rectangle to the document.
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        }
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
