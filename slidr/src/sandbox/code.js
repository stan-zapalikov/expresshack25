import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

// Get the document sandbox runtime.
const { runtime } = addOnSandboxSdk.instance;

const placeholderTitle = "Title Placeholder";

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


function start() {
    // APIs to be exposed to the UI runtime
    // i.e., to the `index.html` file of this add-on.
    const sandboxApi = {
        createRectangle: () => {createTitle(placeholderTitle)}
    };

    // Expose `sandboxApi` to the UI runtime.
    runtime.exposeApi(sandboxApi);
}

start();
