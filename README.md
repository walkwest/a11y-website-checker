# A11y Website Checker

A simple UI that allows a user to input a website URL and check the accessibility of that page against [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) inspection criteria. After analysis, the tool will show a screenshot, a basic score, and a report of the pass/fail rules.

## Requirements

This tool requires 2 parts:

1. The code from this repo
2. An [Node.js API server](https://github.com/walkwest/a11y-audit-server) to run the test scripts

**Do I have to have my own API?**

Well, running an accessibility testing suite on a 3rd party website not your own (through a UI interface like this) turns out to be a pretty difficult task. There are APIs out there you can use, but most of them require a paid subscription. So we ended up writing [our own](https://github.com/walkwest/a11y-audit-server) :muscle:. Feel free to use the library, but you'll need to install it on a server of your own!

If you are simply looking to run more localized testing on a website you own or are developing, take a look at some of these other great (free) tools in this [CSS Tricks Article](https://css-tricks.com/accessibility-testing-tools/).

## How to use

1. Incorporate the html from `index.html` into your webpage
2. Include Javascript file
3. Include CSS*

*\*Demo.css is separate as this is only used for the demo. Style.css is provided*

## Limitations

May not be 100% accurate for dynamically injected content after first page render (i.e. React powered apps) or pages with splash screens.