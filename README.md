# carDHTML
Business card creation tool built with [nw.js](http://nwjs.io/).

## DHTML? Seriously?
Yeah. It's the best umbrella term for HTML & CSS & JavaScript out there, imo.

## What exactly does it do?
You input a HTML file with associated styles and scripts and this bad boy renders it as a PNG for you with [html2canvas.js](http://html2canvas.hertzen.com/). You can set the output dimensions as you like or choose from a  list of countries' standard sizes. If you love CSS and would like to use it to design a business card without additional hassle, this might be useful.

## Why is it a standalone app? Wouldn't it be possible to implement the same functionality in a web page?
While this app is essentially a web page in a webkit browser and it is certainly possible to do the same job without standing alone, I did this as an exercise to take a look at the nw.js project.

## Can I contribute?
Yes, please. The UI needs some work, so you can start with that if you like!

## How do I build this thing?
If you're on Windows, [nodebob](https://github.com/geo8bit/nodebob) is the simplest solution. Clone it, replace the contents of the `app` directory with these files and run the `build.bat`. The ´release´ folder should now contain all the required files to execute the application.
On other operating systems I recommend you to take a look at the [nw.js website](http://nwjs.io/) and [this guide(https://github.com/nwjs/nw.js/wiki/How-to-package-and-distribute-your-apps).

License
-
MIT
