import { pc } from "./deps.ts";

export function getVersion(): string {
  let version = Deno.args[0];
  if (version) {
    console.log("using version from command line", version);
    return version;
  }
  const PKG_VERSION = Deno.env.get("PKG_VERSION");
  if (PKG_VERSION) {
    console.log(`NPM_VERSION values is "${pc.green(PKG_VERSION)}"`);
    version = PKG_VERSION;
    return version;
  }

  const GITHUB_REF = Deno.env.get("GITHUB_REF");
  if (GITHUB_REF) {
    // drop the ref/tag/ and the v prefix
    version = GITHUB_REF.replace(/^.+\/[vV]?/g, "");
    console.log(
      `GITHUB_REF values is ${
        pc.green(
          GITHUB_REF,
        )
      } will be used as version: "${pc.green(version)}"`,
    );
    return version;
  }
  console.log("No version found in environment variables.");
  return "";
}
