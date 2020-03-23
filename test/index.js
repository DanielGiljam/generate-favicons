const spawn = require("child_process").spawn;

const generateFavicons = spawn("bin/generate-favicons.js");

generateFavicons.stdout.on("data", data => {
  process.stdout.write(data);
  const dataToString = data.toString();
  let answer;
  switch (dataToString) {
    case "Specify output directory: ":
      answer = "test/output";
      break;
    case "Do you want to proceed? (yes) ":
      answer = "";
      break;
    case "Specify path to 192x192 favicon: ":
      answer = "test/favicon-192.png";
      break;
    case "Specify path to 32x32 favicon: ":
      answer = "test/favicon-32.png";
      break;
    case "Specify path to 16x16 favicon: ":
      answer = "test/favicon-16.png";
      break;
    case "Specify path to precomposed 180x180 Apple touch icon: ":
      answer = "test/apple-touch-icon-precomposed-180.png";
      break;
    case "Specify path to 558x558 Windows Start Screen tile: ":
      answer = "test/msapplication-largetile.png";
      break;
    case "Specify path to 558x270 wide Windows Start Screen tile: ":
      answer = "test/msapplication-widetile.png";
      break;
    case "Provide color for Windows Start Screen tiles (format: HEX, no alpha-channel): ":
      answer = "#282828";
      break;
    case 'Provide an "application name" to be displayed together with the Windows Start Screen tiles: ':
      answer = "Test";
      break;
    case 'Provide a "tooltip" for the Windows Start Screen tiles: (optional) ':
      answer = "This is a test.";
      break;
    case "Specify path to SVG vector mask of the favicon: ":
      answer = "test/icon-mask.svg";
      break;
    case "Provide color for the icon mask (format: HEX, no alpha-channel): ":
      answer = "#282828";
      break;
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
