# Puppyteer

CLI tool for running Google Chrome DevTools Recordings

[![run](https://github.com/Flaeng/puppyteer/actions/workflows/run.yml/badge.svg)](https://github.com/Flaeng/puppyteer/actions/workflows/run.yml)
[![run with detailed errors](https://github.com/Flaeng/puppyteer/actions/workflows/run-with-errors.yml/badge.svg)](https://github.com/Flaeng/puppyteer/actions/workflows/run-with-errors.yml)
[![run with filter](https://github.com/Flaeng/puppyteer/actions/workflows/run-with-filter.yml/badge.svg)](https://github.com/Flaeng/puppyteer/actions/workflows/run-with-filter.yml)
[![should fail - run with errors](https://github.com/Flaeng/puppyteer/actions/workflows/run-should-fail-with-errors.yml/badge.svg)](https://github.com/Flaeng/puppyteer/actions/workflows/run-should-fail-with-errors.yml)
[![should fail - run](https://github.com/Flaeng/puppyteer/actions/workflows/run-should-fail.yml/badge.svg)](https://github.com/Flaeng/puppyteer/actions/workflows/run-should-fail.yml)

## How to (local)

1) Install puppyteer
```
npm i -g @flaeng/puppyteer 
```

2) Navigate to the folder with the .js-files and run puppyteer

```
puppyteer run
```

Use puppyteer -h for help and list of commands

## How to (Github action)

1) Put your recording-files in a folder at root ('ui-tests' is used as an example)

2) Create a workflow on Github and paste the following code:

```
name: run

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'

      - name: npm install
        run: npm install -g @flaeng/puppyteer

      - name: puppyteer run
        run: puppyteer run -p ui-tests
```


## How to get scripts

Follow Google's guide for the devtools recorder: https://developer.chrome.com/docs/devtools/recorder/

## Known issues

Known issues are shown in [this document](/documentation/known-issues.md)

## Example

![Example 1](/documentation/example1.jpg)

![Supported options](/documentation/supported-options.jpg)