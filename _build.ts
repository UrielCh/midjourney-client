import { build, emptyDir } from "https://deno.land/x/dnt@0.34.0/mod.ts";
// check version here: https://www.npmjs.com/package/midjourney-discord-api
// deno run -A _build.ts 0.0.0;
// cd npm; npm publish;
if (!Deno.args[0]) {
  console.error("Missing version number");
  console.error("usage: deno run -A _build.ts 0.0.0");
  Deno.exit(-1);
}

async function buildDnt() {
  try {
    await emptyDir("./npm");

    await build({
      entryPoints: ["./mod.ts"],
      outDir: "./npm",
      shims: {
        // see JS docs for overview and more options
        deno: true,
        // webSocket: false,
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
          node: ">=14",
        },
      },
    });

    // post build steps
    console.log("extra build steps");
    console.log("cwd:", Deno.cwd());
    Deno.copyFileSync("LICENSE", "npm/LICENSE");
    const readme = Deno.readTextFileSync("README.md");
    // readme = readme.replaceAll('https://deno.land/x/midjourney_discord_api/mod.ts', 'midjourney-discord-api');
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
  } catch (e) {
    console.error(e);
  }
}

buildDnt();
