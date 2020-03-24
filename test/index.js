const spawn = require("child_process").spawn;

const generateFavicons = spawn("bin/generate-favicons.js");

const timeout = setTimeout(() => {
  console.error("Test timed out.");
  process.exit(1);
}, 1000);

const envVarPrefix = "GFT_";
const stdinMockOccasions = [
  {
    regex: /Specify output directory: $/,
    stdin: "test/output",
    envVar: "OUTPUT_DIR"
  },
  {
    regex: /Specify path to 192x192 favicon: $/,
    stdin: "test/favicon-192.png",
    envVar: "F192"
  },
  {
    regex: /Specify path to 32x32 favicon: $/,
    stdin: "test/favicon-32.png",
    envVar: "F32"
  },
  {
    regex: /Specify path to 16x16 favicon: $/,
    stdin: "test/favicon-16.png",
    envVar: "F16"
  },
  {
    regex: /Specify path to precomposed 180x180 Apple touch icon: $/,
    stdin: "test/apple-touch-icon-precomposed-180.png",
    envVar: "A180"
  },
  {
    regex: /Specify path to 558x558 Windows Start Screen tile: $/,
    stdin: "test/msapplication-largetile.png",
    envVar: "MS558"
  },
  {
    regex: /Specify path to 558x270 wide Windows Start Screen tile: $/,
    stdin: "test/msapplication-largetile.png",
    envVar: "MS270"
  },
  {
    regex: /Provide color for Windows Start Screen tiles \(format: HEX, no alpha-channel\): $/,
    stdin: "#ebebeb",
    envVar: "MS_COLOR"
  },
  {
    regex: /Provide an "application name" to be displayed together with the Windows Start Screen tiles: $/,
    stdin: "Test",
    envVar: "MS_NAME"
  },
  {
    regex: /Provide a "tooltip" for the Windows Start Screen tiles: \(optional\) $/,
    stdin: "This is a test.",
    envVar: "MS_TOOLTIP"
  },
  {
    regex: /Specify path to SVG vector mask of the favicon: $/,
    stdin: "test/icon-mask.svg",
    envVar: "MASK"
  },
  {
    regex: /Provide color for the icon mask \(format: HEX, no alpha-channel\): $/,
    stdin: "#f2af0d",
    envVar: "MASK_COLOR",
    clearTimeout: true
  }
];

let accumulatedData = "";
let doNotAcceptStderr = false;
generateFavicons.stdout.on("data", data => {
  process.stdout.write(data);
  accumulatedData += data.toString();
  let stdin;
  stdinMockOccasions.forEach(occasion => {
    if (occasion.regex.test(accumulatedData)) {
      if (occasion.alreadyOccurred) {
        console.log();
        throw new Error(
          `Test gets stuck on ${occasion.regex}, stdin: "${occasion.alreadyOccurred}"`
        );
      }
      if (occasion.clearTimeout) {
        clearTimeout(timeout);
        doNotAcceptStderr = true;
      } else {
        timeout.refresh();
      }
      accumulatedData = "";
      occasion.alreadyOccurred =
        typeof process.env[envVarPrefix + occasion.envVar] !== "undefined"
          ? process.env[envVarPrefix + occasion.envVar]
          : occasion.stdin;
      stdin = occasion.alreadyOccurred;
    }
  });
  if (typeof stdin !== "undefined") {
    stdin += "\n";
    generateFavicons.stdin.write(stdin, "utf-8");
    process.stdout.write(stdin, "utf-8");
  }
});

generateFavicons.stderr.on("data", data => {
  process.stderr.write(data);
  if (doNotAcceptStderr) {
    throw new Error(
      "Script prints to stderr even after doNotAcceptStderr flag has been enabled."
    );
  }
});

generateFavicons.on("error", error => {
  throw error;
});
