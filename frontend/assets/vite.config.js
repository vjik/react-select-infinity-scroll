import {defineConfig} from 'vite'
import path from "path"

export default defineConfig({
    build: {
        target: 'es2015',
        lib: {
            entry: path.resolve(__dirname, "src/main.jsx"),
            name: "App",
            fileName: 'main',
            formats: ['es']
        },
        rollupOptions: {
            output: {
                manualChunks: false,
                inlineDynamicImports: true,
            },
        },
    },
    define: {
        'process.env': process.env,
    }
})
