# A11y Website Checker

A simple UI that allows a user to input their website URL and check the accessibility. After analysis, the tool gives a very basic score - Perfect, Pass, or Fail.

Uses the [Axe Core](https://github.com/dequelabs/axe-core) library under the hood. Screenshots provided by [Thum.io](https://thum.io) which comes with 1000 impressions per month for free after which requires a paid plan.

## Requirements

Currently, this tool is only for use with WordPress.

## Getting Started

1. Include all `/js` files
2. Incorporate the markup from `index.html` into a WordPress PHP file
3. Require `scraper.php` somewhere in your `functions.php` file

* CSS files are optional

## Limitations

Not 100% accurate for dynamically injected content after first page render (i.e. React powered apps).