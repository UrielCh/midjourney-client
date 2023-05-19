import { build, emptyDir } from "https://deno.land/x/dnt@0.35.0/mod.ts";
import * as pc from "https://deno.land/std@0.188.0/fmt/colors.ts";
// check version here: https://www.npmjs.com/package/midjourney-discord-api
// deno run -A _build_npm.ts 0.0.0;
// cd npm; npm publish;

export async function buildDnt() {
  let version = Deno.args[0];
  const GITHUB_REF = Deno.env.get("GITHUB_REF");

  if (!version && GITHUB_REF) {
    // drop the ref/tag/ and the v prefix
    console.log(`GITHUB_REF values is ${pc.green(GITHUB_REF)}`);
    version = GITHUB_REF.replace(/^.+\/[vV]?/g, "");
  }

  if (!version) {
    console.error("Missing version number");
    console.error("usage: deno run -A _build_npm.ts 0.0.0");
    Deno.exit(-1);
  }
  // allow only semver string
  if (!version.match(/[\d]+\.[\d]+\.[\d]+/)) {
    console.error(
      `version number ${
        pc.green(version)
      } do not match Semantic Versioning syntax ${
        pc.green("major.minor.path")
      }`,
    );
    Deno.exit(-1);
  }


    await emptyDir("./npm");

    await build({
      entryPoints: ["./mod.ts"],
      outDir: "./npm",
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
        lib: ["dom", "esnext"],
      },
      package: {
        // package.json properties
        name: "midjourney-discord-api",
        author:
          "Uriel Chemouni <uchemouni@gmail.com> (https://uriel.deno.dev/)",
        license: "MIT",
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
        version: Deno.args[0],
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
      },
      mappings: {
        "https://deno.land/x/discord_api_types@0.37.40/v9.ts": {
          name: "discord-api-types",
          version: "0.37.40",
          peerDependency: false,
          subPath: 'v9',
        },
        "https://deno.land/x/logger@v1.1.0/logger.ts": {
          name: "@denodnt/logger",
          version: "1.1.0",
          peerDependency: false,
        },
      },
    });

    // post build steps
    console.log("extra build steps");
    console.log("cwd:", Deno.cwd());
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    let readme = Deno.readTextFileSync("README.md");
    readme = readme.replaceAll('https://deno.land/x/midjourney_discord_api/mod.ts', 'midjourney-discord-api');
    Deno.writeTextFileSync("npm/README.md", readme);
    //Deno.copyFileSync("README.md", "npm/README.md");
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