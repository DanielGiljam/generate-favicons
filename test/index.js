const spawn = require("child_process").spawn;

const generateFavicons = spawn("bin/generate-favicons.js");

let accumulatedData = "";
generateFavicons.stdout.on("data", data => {
  process.stdout.write(data);
  accumulatedData += data.toString();
  let answer;
  if (/Specify output directory: $/.test(accumulatedData)) {
    accumulatedData = "";
    answer = "test/output";
  }
  if (/Do you want to proceed\? \(yes\) $/.test(accumulatedData)) {
    accumulatedData = "";
    answer = "";
  }
  if (/Specify path to 192x192 favicon: $/.test(accumulatedData)) {
    accumulatedData = "";
    answer = "test/favicon-192.png";
  }
  if (/Specify path to 32x32 favicon: $/.test(accumulatedData)) {
    accumulatedData = "";
    answer = "test/favicon-32.png";
  }
  if (/Specify path to 16x16 favicon: $/.test(accumulatedData)) {
    accumulatedData = "";
    answer = "test/favicon-16.png";
  }
  if (
    /Specify path to precomposed 180x180 Apple touch icon: $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "test/apple-touch-icon-precomposed-180.png";
  }
  if (
    /Specify path to 558x558 Windows Start Screen tile: $/.test(accumulatedData)
  ) {
    accumulatedData = "";
    answer = "test/msapplication-largetile.png";
  }
  if (
    /Specify path to 558x270 wide Windows Start Screen tile: $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "test/msapplication-widetile.png";
  }
  if (
    /Provide color for Windows Start Screen tiles \(format: HEX, no alpha-channel\): $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "#ebebeb";
  }
  if (
    /Provide an "application name" to be displayed together with the Windows Start Screen tiles: $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "Test";
  }
  if (
    /Provide a "tooltip" for the Windows Start Screen tiles: \(optional\) $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "This is a test.";
  }
  if (
    /Specify path to SVG vector mask of the favicon: $/.test(accumulatedData)
  ) {
    answer = "test/icon-mask.svg";
  }
  if (
    /Provide color for the icon mask \(format: HEX, no alpha-channel\): $/.test(
      accumulatedData
    )
  ) {
    accumulatedData = "";
    answer = "#ebebeb";
  }
  if (typeof answer !== "undefined") {
    answer += "\n";
    generateFavicons.stdin.write(answer, "utf-8");
    process.stdout.write(answer, "utf-8");
  }
});

generateFavicons.stderr.on("data", data => {
  console.error(data.toString());
});

generateFavicons.on("error", error => {
  console.error(error.stack);
});
