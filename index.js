#!/usr/bin/env node

import fs from "fs/promises";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import parseCurl from "parse-curl";
import { program } from "commander";

puppeteer.use(StealthPlugin());

async function curlToPuppeteer(curlCommand) {
  try {
    const {
      method,
      url,
      header: nullableHeader,
      data,
    } = parseCurl(curlCommand);
    const header = nullableHeader || {};

    if (!method) {
      throw new Error("No method found");
    }
    if (!url) {
      throw new Error("No url found");
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setExtraHTTPHeaders(header);

    const response = await page.goto(url, { method, body: data });
    const res = await response.text();

    await browser.close();

    return res;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function main() {
  try {
    program
      .option(
        "-f, --file <filePath>",
        "Specify a file containing the curl command"
      )
      .parse(process.argv);

    const options = program.opts();

    let curlCommand = "";

    if (options.file) {
      curlCommand = await fs.readFile(options.file, "utf8");
    } else {
      const args = program.args;
      curlCommand = args.join(" ");
    }

    if (curlCommand === "") {
      throw new Error("No curl command provided");
    }

    const res = await curlToPuppeteer(curlCommand);
    console.log(res);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
