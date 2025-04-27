import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor, colorUtils } from "express-document-sdk";

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

    runtime.exposeApi(sandboxApi);
}

start();
