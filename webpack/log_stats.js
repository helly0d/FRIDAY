import chalk from "chalk";


const MAX_DIGIT = 9;
const MS_DIVISON = 1000;
const S_M_DIVISION = 60;
const HOUR_DIVISION = 24;


function pad(no) {
  return no <= MAX_DIGIT ? `0${no}` : no;
}

function timeLog(...args) {
  let time = new Date();
  const h = pad(time.getHours());
  const m = pad(time.getMinutes());
  const s = pad(time.getSeconds());
  time = `${h}:${m}:${s}`;
  console.log(`[${time}]`, ...args);
}

function displayStats(stats) {
  let ms = stats.endTime - stats.startTime;
  let s = Math.floor(ms / MS_DIVISON);
  let m = Math.floor(s / S_M_DIVISION);
  let h = Math.floor(m / S_M_DIVISION);
  const d = Math.floor(h / HOUR_DIVISION);
  ms = Math.floor((ms % MS_DIVISON));
  s = s % S_M_DIVISION;
  m = m % S_M_DIVISION;
  h = h % HOUR_DIVISION;
  const time = [d, h, m, s, ms];
  const units = ["d", "h", "m", "s", "ms"];
  let measure = "";
  time.forEach(function(val, i) {
    if (val && !measure) {
      const approxTime = time[i + 1] ? `.${time[i + 1]}` : "";
      measure = `${val}${approxTime} ${units[i]}`;
    }
  });
  const {name = "webpack"} = stats.compilation;
  const buildName = `${name} hash`;
  const task = `'${chalk.cyan(buildName)}'`;
  const message = `[ ${chalk.green(stats.hash)} ]`;
  measure = chalk.magenta(measure);
  timeLog("Bundling", task, message, "in", measure);
}

function handleStats(arr, level) {
  if (!arr || !arr.length) {
    return;
  }
  const color = level === "error" ? "red" : "yellow";
  arr.forEach(function(err) {
    const errors = err.split("\n");
    let [,, file, location] = errors.pop().split(" ");
    file = `'${chalk.cyan(file)}'`;
    location = `[ ${location} ]`;
    timeLog(`[${chalk[color](level.toUpperCase())}]`, file, "at", location);
    console.log(`[${chalk[color]("-------v")}]`);
    errors.forEach((line) => console[level](" ", line));
    console.log(`[${chalk[color]("--------")}]`);
  });
  if (level === "error") {
    const errorNo = `[ ${chalk[color](arr.length, `${level}s`)} ]`;
    timeLog("Bundling failed", errorNo);
  }
}


export default function logStats(err, stats) {
  if (err) {
    console.error("Fatal error while building", err);
    process.exit(1);
    return;
  }
  displayStats(stats);
  const {warnings, errors} = stats.toJson();
  handleStats(warnings, "warn");
  handleStats(errors, "error");
}
