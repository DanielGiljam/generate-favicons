#!/usr/bin/env node

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.on("close", () => {
  console.log("");
});

const question = question =>
  new Promise(resolve =>
    readline.question(question, answer => resolve(answer))
  );

const specificQuestion = async (specificQuestion, regex) => {
  let answer;
  let specify;
  do {
    if (specify) console.log("Please enter valid input.");
    answer = await question(specificQuestion);
    specify = true;
  } while (!regex.test(answer));
  return answer;
};

async function generateFavicons() {
  console.log(
    "GENERATE FAVICONS\n\n" +
      "This app generates an exhaustive bundle\n" +
      "with all the files and text needed for favicons.\n" +
      "All files provided must be .png-files, unless some other\n" +
      "file format is explicitly asked for.\n"
  );

  const outputDirectoryPath = path.resolve(
    process.env.PWD,
    await question("Specify output directory: ")
  );

  const iconsDirectoryName = `icons-${crypto.randomBytes(10).toString("hex")}`;

  console.log(
    `Following files/directories will be created at ${outputDirectoryPath}:\n\n` +
      `  head.html\n` +
      `  ${iconsDirectoryName}/\n`
  );

  const proceed = /^(?:yes)?$/.test(
    await specificQuestion("Do you want to proceed? (yes) ", /^(?:yes|no)?$/i)
  );

  if (!proceed) process.exit(0);

  const iconsDirectoryPath = path.resolve(
    outputDirectoryPath,
    iconsDirectoryName
  );

  await fs.promises.mkdir(iconsDirectoryPath, { recursive: true });
  await fs.promises.mkdir(path.resolve(iconsDirectoryPath, "msapplication"));

  const favicon192 = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to 192x192 favicon: ")
    )
  );

  const favicon32 = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to 32x32 favicon: ")
    )
  );

  const favicon16 = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to 16x16 favicon: ")
    )
  );

  appleTouchIconPrecomposed = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to precomposed 180x180 Apple touch icon: ")
    )
  );

  const msapplicationLargetile = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to 558x558 Windows Start Screen tile: ")
    )
  );

  const msapplicationWidetile = sharp(
    path.resolve(
      process.env.PWD,
      await question("Specify path to 558x270 wide Windows Start Screen tile: ")
    )
  );

  const msapplicationColor = await specificQuestion(
    "Provide color for Windows Start Screen tiles (format: HEX, no alpha-channel): ",
    /^#(?:[0-9a-f]{3}){1,2}$/i
  );

  const msapplicationName = await question(
    'Provide an "application name" to be displayed together with the Windows Start Screen tiles: '
  );

  const msapplicationTooltip = await question(
    'Provide a "tooltip" for the Windows Start Screen tiles: (optional) '
  );

  const iconMask = await fs.promises.readFile(
    path.resolve(
      process.env.PWD,
      await question("Specify path to SVG vector mask of the favicon: ")
    ),
    "utf-8"
  );

  const iconMaskColor = await specificQuestion(
    "Provide color for the icon mask (format: HEX, no alpha-channel): ",
    /^#(?:[0-9a-f]{3}){1,2}$/i
  );

  const ieconfig = (
    await fs.promises.readFile(
      path.resolve(__dirname, "../msapplication/ieconfig.xml"),
      "utf-8"
    )
  ).replace("${wssTileColor}", msapplicationColor);

  const head = (
    await fs.promises.readFile(path.resolve(__dirname, "../head.html"), "utf-8")
  )
    .replace(/\${iconDirectory}/g, iconsDirectoryName)
    .replace("${iconMaskColor}", iconMaskColor)
    .replace("${wssTileColor}", msapplicationColor)
    .replace("${wssAppName}", msapplicationName)
    .replace("${wssTooltip}", msapplicationTooltip || msapplicationName);

  return Promise.allSettled([
    favicon192.clone
      .resize(192)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-192.png")),
    favicon192.clone
      .resize(180)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-180.png")),
    favicon192.clone
      .resize(152)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-152.png")),
    favicon192.clone
      .resize(144)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-144.png")),
    favicon192.clone
      .resize(128)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-128.png")),
    favicon192.clone
      .resize(120)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-120.png")),
    favicon192.clone
      .resize(96)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-96.png")),
    favicon192.clone
      .resize(76)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-76.png")),
    favicon192.clone
      .resize(57)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-57.png")),
    favicon32
      .resize(32)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-32.png")),
    favicon16
      .resize(16)
      .toFile(path.resolve(iconsDirectoryPath, "favicon-16.png")),
    appleTouchIconPrecomposed
      .resize(180)
      .toFile(
        path.resolve(iconsDirectoryPath, "apple-touch-icon-precomposed-180.png")
      ),
    msapplicationLargetile.clone
      .resize(558)
      .toFile(path.resolve(iconsDirectoryPath, "msapplication/largetile.png")),
    msapplicationLargetile.clone
      .resize(270)
      .toFile(path.resolve(iconsDirectoryPath, "msapplication/mediumtile.png")),
    msapplicationLargetile.clone
      .resize(128)
      .toFile(path.resolve(iconsDirectoryPath, "msapplication/smalltile.png")),
    msapplicationWidetile
      .resize(558)
      .toFile(path.resolve(iconsDirectoryPath, "msapplication/widetile.png")),
    fs.promises.writeFile(
      path.resolve(iconsDirectoryPath, "msapplication/ieconfig.xml"),
      ieconfig
    ),
    fs.promises.writeFile(
      path.resolve(iconsDirectoryPath, "icon-mask.svg"),
      iconMask
    ),
    fs.promises.writeFile(path.resolve(outputDirectoryPath, "head.html"), head)
  ]);
}

generateFavicons()
  .then(results => {
    results.forEach(result => {
      result.status === "fulfilled"
        ? console.log("info:", result.value)
        : console.error(result.reason.message);
    });
  })
  .catch(error => {
    console.error(error.stack);
    process.exit(1);
  });
