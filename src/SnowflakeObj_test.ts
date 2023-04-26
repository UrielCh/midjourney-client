import { assertEquals } from "https://deno.land/std@0.184.0/testing/asserts.ts";
import { SnowflakeObj } from "./SnowflakeObj.ts";

Deno.test(function SnowflakeTest() {
    const snowflake = new SnowflakeObj("1099263078077579316");
    assertEquals(snowflake.timestamp, 1682155141134); // 2023-04-22T09:19:01.134Z
    assertEquals(snowflake.workerId, 2);
    assertEquals(snowflake.processId, 4);
    assertEquals(snowflake.increment, 52);
  });
  