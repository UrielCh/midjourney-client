import { pc } from "../deps.ts";

export function progressLogger(text: string): (percent: number) => void {
  const queue = Date.now();
  let started = 0;
  text = `${pc.brightWhite("Progress> ")} ${text}`;
  return (percent: number) => {
    if (percent < 0) {
      console.log(`${text} ${pc.red("Not Started yet")}`);
      return;
    }
    if (!started) {
      started = Date.now();
    }
    if (percent === 1) {
      const done = Date.now();
      const queueTime = ((started - queue) / 1000).toFixed(1);
      const processTime = ((done - started) / 1000).toFixed(1);
      console.log(`${text} ${pc.green("done")} QueueTime: ${pc.yellow(queueTime)} Sec; ProcessTime: ${pc.yellow(processTime)} Sec`);
    } else {
      console.log(`${text} in progress ${pc.green((percent * 100).toFixed(0))}%`);
    }
  };
}
