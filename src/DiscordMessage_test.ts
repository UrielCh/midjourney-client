import { assertEquals, assertExists } from "../dev_deps.ts";
import { extractPrompt } from "./DiscordMessage.ts";

Deno.test(function ParseMidJourneyVariationsFast() {
  const p1 = extractPrompt(
    "**drawing of an office id badge design template colorful --v 5** - Variations by <@1097074882203303911> (fast)",
  );
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
  const p1 = extractPrompt(
    "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Open on website for full quality) (relaxed)",
  );
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyDoneRelaxed2() {
  const p1 = extractPrompt(
    "**ice creams, pinkcore, organic shapes --v 5** - <@1097074882203303911> (relaxed)",
  );
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
  // assertEquals(p1.type, "grid");
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyDoneRelaxed2() {
  const p1 = extractPrompt(
    "**ice creams, pinkcore, organic shapes --v 5** - <@1097074882203303911> (paused) (relaxed)",
  );
  assertExists(p1);
  assertEquals(p1.prompt, "ice creams, pinkcore, organic shapes --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
  // assertEquals(p1.type, "grid");
  assertEquals(p1.mode, "relaxed");
});

Deno.test(function ParseMidJourneyDoneUpscall() {
  const p1 = extractPrompt(
    "**A Big wave in the ocean style like Kanagawa --v 5** - Image #4 <@1097074882203303911>",
  );
  assertExists(p1);
  assertEquals(p1.prompt, "A Big wave in the ocean style like Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  // assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyImagineRelaxedProgress() {
  const p1 = extractPrompt(
    "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (62%) (relaxed)",
  );
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
  const p1 = extractPrompt(
    "**a view of Paris drawn by Kanagawa --v 5** - <@1097074882203303911> (Waiting to start)",
  );
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
  const p1 = extractPrompt(
    "**a view of Paris drawn by Kanagawa --v 5** - Variations by <@1097074882203303911> (Open on website for full quality) (relaxed)",
  );
  assertExists(p1);
  assertEquals(p1.prompt, "a view of Paris drawn by Kanagawa --v 5");
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});

Deno.test(function ParseMidJourneyUpscaled() {
  const p1 = extractPrompt(
    "**a view of Paris drawn by Kanagawa --v 5 --seed 6894** - Upscaled by <@1097074882203303911> (fast)",
  );
  assertExists(p1);
  assertEquals(
    p1.prompt,
    "a view of Paris drawn by Kanagawa --v 5 --seed 6894",
  );
  assertEquals(p1.id, "1097074882203303911");
  assertEquals(p1.completion, 1);
});
