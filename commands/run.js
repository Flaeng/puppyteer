const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const cliSpinners = require('cli-spinners');
const glob = require('glob');

//https://stackoverflow.com/questions/58570325/how-to-turn-child-process-spawns-promise-syntax-to-async-await-syntax
async function runScriptAsync(path) {
    const child = spawn('node', [path]);

    let error = "";
    for await (const chunk of child.stderr) {
        error += chunk;
    }

    const exitCode = await new Promise((resolve, reject) => {
        child.on('close', resolve);
    });

    return { exitCode, error };
}

async function runAllScripts(testList, showErrors) {

    for (let i = 0; i < testList.length; i++) {
        const elem = testList[i];

        const spinner = ora({
            spinner: cliSpinners.point,
            prefixText: `[${(i + 1).toString().padStart(testList.length.toString().length, '0')}/${testList.length}] ${elem.filename}`
        }).start();

        const result = await runScriptAsync(elem.filepath);

        if (result.exitCode === 0) {
            spinner.succeed(chalk.green.bold('success'));
        } else {
            spinner.fail(chalk.red.bold('failed'));
            if (showErrors === true) {
                console.error(result.error);
            }
        }
        elem.exitCode = result.exitCode;
    }

    return testList.filter(x => x.exitCode === 0).length === testList.length;
}

async function run(args) {
    const relativePath = args.path || __dirname;

    if (fs.existsSync(relativePath) === false) {
        console.error(`Directory at path not found: ${relativePath}`);
        return 1;
    }

    var tests = glob.sync(path.join(relativePath, args.filter || "*"))
        .filter(x => path.extname(x).toLocaleLowerCase() === '.js')
        .map(x => { return { filepath: x, filename: path.basename(x), exitCode: null, error: null }; });

    const runExitCode = await runAllScripts(tests, args.errors);
    //console.log('runExitCode', runExitCode);
    return runExitCode ? 0 : 1;
}

module.exports = run;