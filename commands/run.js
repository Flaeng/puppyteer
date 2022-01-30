const fs = require('fs');
const core = require('@actions/core');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const process = require('process');
const cliSpinners = require('cli-spinners');
const glob = require('glob');

//https://stackoverflow.com/questions/58570325/how-to-turn-child-process-spawns-promise-syntax-to-async-await-syntax
async function runScriptAsync(path) {

    let error = '';
    const exitCode = await new Promise((resolve, reject) => {
        const cmd = `node ${path}`;
        exec(cmd, (err, stdout, stderr) => {
            if (err) {
                error = err;
                reject(err);
                return;
            }
            resolve('success');
        })
    });
/*
    const child = spawn('node', [path]);

    let error = "";
    for await (const chunk of child.stderr) {
        error += chunk;
    }

    const exitCode = await new Promise((resolve, reject) => {
        child.on('close', resolve);
    });
*/
console.log('exitCode', exitCode);
console.log('typeof exitCode', typeof exitCode);
    return { exitCode, error };
}

async function runAllScriptsAsync(testList, showErrors) {

    for (let index = 0; index < testList.length; index++) {
        try {
            const elem = testList[index];

            const spinner = ora({
                spinner: cliSpinners.point,
                prefixText: `[${(index + 1).toString().padStart(testList.length.toString().length, '0')}/${testList.length}] ${elem.filename}`
            }).start();
            
            const result = await runScriptAsync(elem.filepath);
            
            if (result.exitCode === 0) {
                //console.log(chalk.green.bold('success'));
                spinner.succeed(chalk.green.bold('success'));
            } else {
                //console.log(chalk.red.bold('failed'));
                spinner.fail(chalk.red.bold('failed'));
                if (showErrors === true) {
                    console.error(result.error);
                }
            }
            elem.exitCode = result.exitCode;
        }
        catch (e) {
            console.error(e);
        }
    }

    return testList.filter(x => x.exitCode === 0).length === testList.length;
}

async function run(args) {
    const relativePath = args.path || process.cwd();

    if (fs.existsSync(relativePath) === false) {
        console.error(`Directory at path not found: ${relativePath}`);
        return 1;
    }

    var tests = glob.sync(path.join(relativePath, args.filter || "*"))
        .filter(x => path.extname(x).toLocaleLowerCase() === '.js')
        .map(x => { return { filepath: x, filename: path.basename(x), exitCode: null, error: null }; });

    const didSucceed = await runAllScriptsAsync(tests, args.errors);
    if (didSucceed === false) {
        if (core) {
            core.setFailed('One or more scripts failed');
            //process.exit(1);
            return 1;
        }
        return 1;
    }
    return 0;
}

module.exports = run;