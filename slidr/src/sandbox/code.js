import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

const placeholderTitle = "Title Placeholder";
const bulletsPlaceholder = [
    "Bullet 1 Placeholder",
    "Bullet 2 Placeholder",
    "Bullet 3 Placeholder"
];

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

function createSlides() {
    
}

function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
        createRectangle: () => {createSlide(placeholderTitle, bulletsPlaceholder);},
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
