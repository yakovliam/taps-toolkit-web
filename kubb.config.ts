import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginReactQuery } from "@kubb/plugin-react-query";

export default defineConfig({
  name: "taps-toolkit-openapi",
  root: "./",
  input: {
    path: "./taps-toolkit-openapi.yaml",
  },
  output: {
    path: "./src/gen",
  },
  plugins: [
    pluginOas(),
    pluginTs(),
    pluginReactQuery({
      output: {
        path: "./hooks",
      },
      group: {
        type: "tag",
        name: ({ group }) => `${group}Hooks`,
      },
      client: {
        dataReturnType: "full",
        importPath: "@/lib/client",
      },
      mutation: {
        methods: ["post", "put", "delete"],
      },
      infinite: {
        queryParam: "next_page",
        initialPageParam: 0,
        cursorParam: "nextCursor",
      },
      query: {
        methods: ["get"],
        importPath: "@tanstack/react-query",
      },
      suspense: {},
    }),
  ],
});
