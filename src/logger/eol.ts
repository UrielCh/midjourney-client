const os = Deno.build.os;
const eol = os === "windows" ? "\r\n" : "\n";
export default eol;
