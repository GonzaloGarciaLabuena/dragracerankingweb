import { defineConfig } from "vitest/config";
import { fileURLToPath } from "url";

export default defineConfig({
    resolve: {
        alias: {
            "@": fileURLToPath(new URL(".", import.meta.url))
        }
    },

    test: {
        globals: true,
        environment: "node",

        coverage: {
            provider: "v8",
            reporter: ["text", "html"]
        }
    }
});