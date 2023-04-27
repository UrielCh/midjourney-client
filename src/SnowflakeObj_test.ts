import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import { SnowflakeObj } from "./SnowflakeObj.ts";

Deno.test(function SnowflakeTest() {
  const snowflake = new SnowflakeObj("1099263078077579316");
  assertEquals(snowflake.timestamp, 1682155141134); // 2023-04-22T09:19:01.134Z
  assertEquals(snowflake.workerId, 2);
  assertEquals(snowflake.processId, 4);
  assertEquals(snowflake.increment, 52);
});


Deno.test(function SnowflakeUniq() {
  const snowflakes: SnowflakeObj[] = [];
  for (let i=0; i<10; i++) {
    snowflakes.push(new SnowflakeObj());
  }
  const list: string[] = snowflakes.map(a=> a.encode());
  const set = new Set(list);
  assertEquals(set.size,10);
});
