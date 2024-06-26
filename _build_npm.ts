// dnt deps can not be moved to dev_deps.ts
import { build, emptyDir, type PackageJson } from "@deno/dnt";
import { pc } from "./deps.ts";
import { getVersion } from "./_tools.ts";

export async function buildDnt() {
  const version = getVersion();
  if (!version) {
    console.error("Missing version number");
    console.error("usage: deno run -A _build_npm.ts 0.0.0");
    Deno.exit(-1);
  }
  // allow only semver string
  if (!version.match(/[\d]+\.[\d]+\.[\d]+/)) {
    console.error(
      `version number ${
        pc.green(
          version,
        )
      } do not match Semantic Versioning syntax ${
        pc.green(
          "major.minor.path",
        )
      }`,
    );
    Deno.exit(-1);
  }

  const depsts = Deno.readTextFileSync("deps.ts");
  const depstsPatch = depsts.replaceAll(
    "jsr:@deno-lib/logger@1.1.5",
    "https://deno.land/x/logger@v1.1.5/logger.ts",
  );

  Deno.writeTextFileSync("deps.ts", depstsPatch);

  const packageJson: PackageJson = {
    // package.json properties
    name: "midjourney-discord-api",
    author: "Uriel Chemouni <uchemouni@gmail.com> (https://uriel.deno.dev/)",
    license: "MIT",
    funding: "https://github.com/UrielCh/midjourney-client?sponsor=1",
    contributors: [],
    description: "Midjourney client using Discord.",
    keywords: [
      "Midjourney",
      "Midjourney-api",
      "Midjourney",
      "Wrapper",
      "Discord",
      "api",
      "ai",
      "text2image",
      "deno",
      "img2prompt",
      "prompt2img",
    ],
    homepage: "https://github.com/UrielCh/midjourney-client",
    version,
    repository: {
      type: "git",
      url: "git+https://github.com/UrielCh/midjourney-client.git",
    },
    bugs: {
      url: "https://github.com/UrielCh/midjourney-client/issues",
    },
    "engine-strict": {
      node: ">=18",
    },
  };
  await emptyDir("./npm");

  await build({
    entryPoints: ["./mod.ts"],
    outDir: "./npm",
    test: "no-run" as unknown as true,
    declaration: "separate",
    shims: {
      // see JS docs for overview and more options
      deno: true,
      // webSocket: true,
      // undici: true,
      custom: [
        //   {
        //     package: {
        //       name: "stream/web",
        //     },
        //     globalNames: ["ReadableStream", "TransformStream"],
        //   },
        //   {
        //     globalNames: [{ name: "MessageEvent", typeOnly: true }],
        //     package: {
        //       name: "ws",
        //     },
        //   }
      ],
    },
    compilerOptions: {
      lib: ["DOM", "ESNext"],
    },
    package: packageJson,
    mappings: {
      // no more mappings needed using npm: prefix
      // "https://deno.land/x/discord_api_types@0.37.84/v9.ts": {
      //   name: "discord-api-types",
      //   version: "0.37.84",
      //   peerDependency: false,
      //   subPath: "v9",
      // },
      // "https://deno.land/x/logger@v1.1.0/logger.ts": {
      //   name: "@denodnt/logger",
      //   version: "1.1.0",
      //   peerDependency: false,
      // },
      // "jsr:@deno-lib/logger@1.1.5"
      // "https://deno.land/x/logger@v1.1.5/logger.ts"
      "https://deno.land/x/logger@v1.1.5/logger.ts": {
        name: "@denodnt/logger",
        version: "1.1.5",
        peerDependency: false,
      },
    },
  });

  // post build steps
  console.log("extra build steps");
  console.log("cwd:", Deno.cwd());
  Deno.copyFileSync("LICENSE", "npm/LICENSE");
  let readme = Deno.readTextFileSync("readme.md");
  readme = readme.replaceAll(
    "https://deno.land/x/midjourney_discord_api/mod.ts",
    "midjourney-discord-api",
  );
  Deno.writeTextFileSync("npm/README.md", readme);
  Deno.writeTextFileSync("deps.ts", depsts);

  // Deno.copyFileSync("README.md", "npm/README.md");
  // Deno.mkdirSync("npm/types/types");
  // const files = Deno.readDirSync("types");
  // for (const file of files) {
  //   if (!file.isFile)
  //     continue;
  //   let text = Deno.readTextFileSync(`types/${file.name}`)
  //   text = text.replace(/.d.ts(["'])/g, "$1");
  //   Deno.writeTextFileSync(`npm/types/types/${file.name}`, text);
  //   console.log(`copy types/${file.name} to npm/types/types/${file.name}`)
  // }
  //Deno.copyFileSync("types", "npm/types");
}

if (import.meta.main) {
  buildDnt();
}
