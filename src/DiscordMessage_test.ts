import { assertEquals, assertExists } from "../dev_deps.ts";
import { extractPrompt } from "./DiscordMessage.ts";

const midjourneyBotId = "936929561302675456";

Deno.test(function ParseMidJourneyVariationsFast() {
  const p = "**drawing of an office id badge design template colorful --v 5** - Variations by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(
    p1.prompt,
    "drawing of an office id badge design template colorful --v 5",
  );
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
  assertEquals(p1.mode, "fast");
});

Deno.test(function ParseMidJourneyDoneRelaxed() {
  const p = "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Open on website for full quality) (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyStoped() {
  const p = "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Stopped)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, -1);
});

Deno.test(function ParseMidJourneyDoneRelaxed2() {
  const p = "**ice creams, pinkcore, organic shapes --v 5** - <@1097074882203303911> (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
  // assertEquals(p1.type, "grid");
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyDoneRemix() {
  const p = "**ice creams, pinkcore, organic shapes --v 5** - Remix by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
  assertEquals(p1.mode, "fast");
});

Deno.test(function randomUpscale() {
  const p = "**ice creams, pinkcore, organic shapes --v 5 --ar 3:2** - Image #1 <@1097074882203303911>";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5 --ar 3:2");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyDoneRelaxed2() {
  const p = "**ice creams, pinkcore, organic shapes --v 5** - <@1097074882203303911> (paused) (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
  // assertEquals(p1.type, "grid");
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyDoneUpscall() {
  const p = "**A Big wave in the ocean style like Kanagawa --v 5** - Image #4 <@1097074882203303911>";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "A Big wave in the ocean style like Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyImagineRelaxedProgress() {
  const p = "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (62%) (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(
    p1.prompt,
    "a view of Paris drawn by Kanagawa --v 5",
    "should extract the correct prompt",
  );
  assertEquals(
    p1.id,
    "1097074882203303911",
    "should extract the correct user id",
  );
  assertEquals(p1.completion, 0.62, "should collect progression percent");
  assertEquals(p1.mode, "relaxed", "should collect mode as relax");
});

Deno.test(function ParseMidJourneyImagineRelaxedQueue() {
  const p = "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Waiting to start)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(
    p1.prompt,
    "a view of Paris drawn by Kanagawa --v 5",
    "should extract the correct prompt",
  );
  assertEquals(
    p1.id,
    "1097074882203303911",
    "should extract the correct user id",
  );
  assertEquals(p1.completion, -1);
});

Deno.test(function ParseMidJourneyWebsiteFullQuality() {
  const p = "**a view of Paris drawn by Kanagawa --v 5** - Variations by <@1097074882203303911> (Open on website for full quality) (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyUpscaled() {
  const p = "**a view of Paris drawn by Kanagawa --v 5 --seed 6894** - Upscaled by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(
    p1.prompt,
    "a view of Paris drawn by Kanagawa --v 5 --seed 6894",
  );
  assertEquals(p1.mode, "fast");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyUpscaledFastStealth() {
  const p = "**a view of Paris drawn by Kanagawa --v 5 --seed 6894** - Upscaled by <@1097074882203303911> (fast, stealth)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(
    p1.prompt,
    "a view of Paris drawn by Kanagawa --v 5 --seed 6894",
  );
  assertEquals(p1.mode, "fast, stealth");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariantStreamContentWait() {
  const p = "Making variations for image #1 with prompt **a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Waiting to start)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, -1);
});

Deno.test(function ParseVariantStreamContentPercent() {
  const p = "**a view of Paris drawn by Kanagawa --v 5.1** - Variations by <@1097074882203303911> (0%) (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5.1");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 0);
});

Deno.test(function MergeCompleted() {
  const p = "**<https://s.mj.run/abc> <https://s.mj.run/def> --ar 2:3 --v 5.1** - <@1097074882203303911> (relaxed)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "<https://s.mj.run/abc> <https://s.mj.run/def> --ar 2:3 --v 5.1");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariantVariationStrongTodo() {
  const p = "**a view of Paris drawn by Kanagawa** - Variations (Strong) by <@1097074882203303911> (Waiting to start)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, -1);
});

Deno.test(function ParseVariantVariationStrongDone() {
  const p = "**a view of Paris drawn by Kanagawa** - Variations (Strong) by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariantVariationSubtleDone() {
  const p = "**a view of Paris drawn by Kanagawa** - Variations (Subtle) by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariantVariationSubtleDoneTurbo() {
  const p = "**a view of Paris drawn by Kanagawa** - Variations (Subtle) by <@1097074882203303911> (turbo)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariantVariationSubtleDone() {
  const p = "Upscaling image #2 with **a view of Paris drawn by Kanagawa** - <@1097074882203303911> (Waiting to start)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, -1);
});

Deno.test(function ParseVariant202401() {
  const p =
    "**Simple, vector, colors to be used are black and white --s 250 --v 6.0** - Remix (Subtle) by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.mode, "fast");
  assertEquals(
    p1.prompt,
    "Simple, vector, colors to be used are black and white --s 250 --v 6.0",
  );
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});


Deno.test(function ParseVariant1715870086617() {
  const p = "**<https://s.mj.run/Xg2Gq1TXMgc> 4k, masterpiece, on white background --v 6.0** - Upscaled (Subtle) by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "<https://s.mj.run/Xg2Gq1TXMgc> 4k, masterpiece, on white background --v 6.0");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseVariant1715870200212() {
  const p = "**neon genesis evangelion rey ayanami in her pilot suit, hyper realistic and futuristic style, bright image** - Zoom Out by <@1097074882203303911> (fast)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "neon genesis evangelion rey ayanami in her pilot suit, hyper realistic and futuristic style, bright image");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});


Deno.test(function ParseVariant1715872653295() {
  const p = "**steampunk, dieselpunk, steampunk style art, highly detailed, intricate details, cinematic light, --ar 9:16 --c 10 --v 5.2** - <@1097074882203303911> (turbo, stealth)";
  const p1 = extractPrompt(p, midjourneyBotId);
  assertExists(p1, "extractPrompt should return a prompt object");
  assertEquals(p1.prompt, "steampunk, dieselpunk, steampunk style art, highly detailed, intricate details, cinematic light, --ar 9:16 --c 10 --v 5.2");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});
