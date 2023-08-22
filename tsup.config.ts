import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "./src/index.ts",
    // Add for specific libraries to be imported from 'mediator/[react...]'
  },
  splitting: true,
  sourcemap: false,
  clean: true,
  minify: true,
});
