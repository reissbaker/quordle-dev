import { defineConfig } from 'vite';
import { ViteEjsPlugin } from "vite-plugin-ejs";
import viteSentry from 'vite-plugin-sentry';
import solidPlugin from 'vite-plugin-solid';

const sentryEnv = process.env.SENTRY_ENV || ""
const sentryToken = process.env.SENTRY_TOKEN || ""

export default defineConfig({
  plugins: [solidPlugin(), viteSentry({
    authToken: sentryToken,
    org: "quordle",
    project: "quordle",
    release: process.env.npm_package_version,
    deploy: {
      env: sentryEnv
    },
    setCommits: {
      auto: true
    },
    sourceMaps: {
      include: ["./dist/assets"],
      ignore: ["node_modules"],
      urlPrefix: "~/assets"
    },
    debug: true
  }), ViteEjsPlugin({
    sentry_env: sentryEnv,
    sentry_release: process.env.npm_package_version
  })],
  build: {
    target: "es2015",
    sourcemap: true
  },
  server: {
    host: true
  }
});
