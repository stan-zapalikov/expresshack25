import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

function start() {
    const sandboxApi = {
        generatePresentation(outline, themeUsed, addImages) {
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();
