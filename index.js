#! /usr/bin/env node
const { program } = require('commander');
const run = require('./commands/run.js');

program.name('puppyteer');

program
    .command('run')
    .option('-p, --path <path>', 'Path to files (default: current directory)')
    .option('-f, --filter <filter>', 'Filter which files should be runned (default: "*")')
    .option('-e, --errors', 'Show detailed error messages')
    .option('-d, --domain <domain>', 'Change the domain of the url that all tests starts on')
    .description('Runs all .js files in selected path')
    .action(run);

program.parse();