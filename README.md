# Generate Favicons

I did some research a while back on favicons. Unfortunately I don't remember my sources. All I did at the time was consolidate my research into a list of favicons and `<head>` element tags that you need to ensure your icon is displayed nicely on most browsers and devices. My list tries to be exhaustive but at the same time not excessive (you could call it opinionated). In other words, I didn't include every single favicon variant or resolution that I read on the internet that might be used by some browser or device in some rare scenario. I picked the most common resolutions and variants ensuring (1.) that a wide range of different sizes would be available and that (2.) there would be dedicated variants for the biggest platforms out there such as iOS, Android and Windows.

## Usage

Note two things:

- You must have Node v12.9.0 or later.
- The script was made and tested in a UNIX environment. It may run on Windows as well, but I make no guarantees.

Install the script.

```bash
# Installs the script globally
npm i -g generate-favicons
```

Before you run the script, make sure you have your favicon in these formats:

- PNG, width: 192px, height: 192px
- PNG, width: 32px, height: 32px<br>(you can pass a higher resolution version, it will be rescaled by the script, but I recommended that you make dedicated versions of your favicon for low resolutions since a lot of detail is lost when rescaling to low resolutions)
- PNG, width: 16px, height: 16px<br>(you can pass a higher resolution version, it will be rescaled by the script, but I recommended that you make dedicated versions of your favicon for low resolutions since a lot of detail is lost when rescaling to low resolutions)
- PNG, width: 180px, height: 180px, variant: "precomposed Apple touch icon"
- PNG, width: 558px, height: 558px, variant: "Windows Start Screen tile"
- PNG, width: 558px, height: 270px, variant: "wide Windows Start Screen tile"
- SVG, variant: "icon mask"

Run the script and follow the instructions displayed in your terminal.

```bash
generate-favicons
```

Once you've successfully run the script, you'll have the following in your chosen output directory:

- `head.html`<br>Contains a `<head>` element where all the tags that you need for your favicons have been set up. You can copy-paste them from here to your "actual" `<head>` element.
- `icons-blrgzzzz692152406832/`<br>The directory where your favicons reside. Random characters are appended to the directory's name for cache busting. The following can be found within the directory.
  - `favicon-16.png`
  - `favicon-32.png`
  - `favicon-57.png`
  - `favicon-76.png`
  - `favicon-96.png`
  - `favicon-120.png`
  - `favicon-128.png`
  - `favicon-144.png`
  - `favicon-152.png`
  - `favicon-180.png`
  - `favicon-192.png`
  - `apple-touch-icon-precomposed-180.png`
  - `icon-mask.svg`
  - `msapplication/ieconfig.xml`
  - `msapplication/smalltile.png`
  - `msapplication/mediumtile.png`
  - `msapplication/largetile.png`
  - `msapplication/widetile.png`
