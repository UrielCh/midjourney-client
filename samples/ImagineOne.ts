import { Midjourney } from "../mod.ts";
import { progressLogger } from "./progressLogger.ts";

const client = new Midjourney("interaction.txt");
await client.connectWs();
//Use the --fast --turbo or --relax command to explicitly set the generation speed.
let basePrompt = "einstein mathematician studying at school";
basePrompt = "Harry Potter and the Prisoner of Azkaban cover";
basePrompt =
  "A professional setting featuring a diverse group of tech experts working collaboratively in a modern office. Emphasize the themes of innovation and agility in technology. Show elements of AI and Blockchain, like holographic displays, digital interfaces, and data analytics. Display a futuristic and dynamic atmosphere, showcasing teamwork and cutting-edge technology in North America. Ensure the setting is sleek and high-tech, with a focus on business transformation and innovation.";
basePrompt += " --relax";

const msg = await client.imagine(basePrompt, progressLogger(`seed #random`));
await msg.download(0, "images");
client.close();
