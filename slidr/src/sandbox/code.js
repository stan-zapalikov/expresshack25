import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

function start() {
    const sandboxApi = {
        generatePresentation(outline, themeUsed, addImages) {
            console.log("Received outline:", outline);
            console.log("Theme:", themeUsed);
            console.log("Add Images?", addImages);

            // Example: Create a title
            if (outline.title) {
                const title = editor.createText();
                title.fullContent.text = outline.title;
                title.fullContent.applyCharacterStyles({ fontSize: 48 });
                title.fill = editor.makeColorFill({ red: 0, green: 0, blue: 0, alpha: 1 });
                title.setPositionInParent({ x: 50, y: 100 }, title.topLeftLocal);
                editor.context.insertionParent.children.append(title);
            }

            // You could loop and create slides/sections here dynamically 🔥
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();
