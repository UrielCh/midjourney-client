// const format = n => n > 9 ? n : `0${n}`;
const format = (n: number) => n.toString().padStart(2, "0");

export default class Dater extends Date {
  toLocaleString(separator = "-"): string {
    const dateString = this.toLocaleDateString(separator);
    const timeString = this.toLocaleTimeString();
    return `${dateString} ${timeString}`;
  }

  toLocaleDateString(separator = "-"): string {
    const year = format(this.getFullYear());
    const month = format(this.getMonth() + 1);
    const day = format(this.getDate());
    return `${year}${separator}${month}${separator}${day}`;
  }

  toLocaleTimeString(): string {
    const hour = format(this.getHours());
    const minute = format(this.getMinutes());
    const second = format(this.getSeconds());
    return `${hour}:${minute}:${second}`;
  }
}
