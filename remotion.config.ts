import fs from "node:fs";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);

const winChrome = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
if (process.platform === "win32" && fs.existsSync(winChrome)) {
  Config.setChromeMode("chrome-for-testing");
  Config.setBrowserExecutable(winChrome);
}
