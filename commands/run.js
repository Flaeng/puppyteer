const fs = require('fs');
const core = require('@actions/core');
const path = require('path');
const { exec } = require('child_process');
const chalk = require('chalk');
const ora = require('ora');
const process = require('process');
const cliSpinners = require('cli-spinners');
const glob = require('glob');

async function runScriptAsync(path) {
    try {
        return await new Promise((resolve, reject) => {
            const cmd = `node ${path}`;
            const start = new Date();
            exec(cmd, (err, stdout, stderr) => {
                const duration = new Date() - start;
                if (err) {
                    reject({ exitCode: 1, error: err, duration });
                    return;
                }
                resolve({ exitCode: 0, error: null, duration });
            })
        });
    }
    catch (e) {
        return { exitCode: 1, error: e };
    }
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
                spinner.succeed(chalk.green.bold(`success`) + ` in ${result.duration}ms`);
            } else {
                //spinner.fail(chalk.red.bold(`failed in ${result.duration}ms`));
                spinner.fail(chalk.red.bold(`failed`));
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

async function handleDomain(tests, domain) {
    return await new Promise(async (resolve, reject) => {
        const tempFolder = `./.puppyteer/`;
        const dom = (domain.startsWith('http://') || domain.startsWith('https://')) ? domain : `https://${domain}`;
        for (let index = 0; index < tests.length; index++) {
            const element = tests[index];

            await new Promise((fileWriteResolve, reject) => {
                fs.readFile(element.filepath, 'utf8', (err, data) => {
                    if (err) {
                        console.warn(err);
                        return;
                    }

                    const dataSplit = data.split('\n');
                    const targetPageGoToIndex = dataSplit.map((x, index) => {
                        if (x.trimStart().startsWith('await targetPage.goto(')) {
                            return index;
                        } else {
                            return -1;
                        }
                    }).filter(x => x != -1);
                    if (targetPageGoToIndex.length === 0) {
                        throw `Failed to find line with "await targetPage.goto(" in file at path: ${element.filepath}`;
                    }
                    dataSplit[targetPageGoToIndex[0]] = `        await targetPage.goto('${dom}');`;

                    const newFilePath = `${tempFolder}${element.filepath}`;
                    const directoryPath = newFilePath.split('/').slice(0, -1).join('/');
                    if (!fs.existsSync(directoryPath)) {
                        fs.mkdirSync(directoryPath, { recursive: true });
                    }

                    fs.writeFile(newFilePath, dataSplit.join('\n'), err => {
                        if (err) {
                            console.warn(err);
                            return;
                        }
                        console.log('newFilePath', newFilePath);
                        element.filepath = newFilePath;
                        fileWriteResolve();
                    })
                });
            });
        }
        resolve();
    });
}

async function run(args) {
    const relativePath = args.path || process.cwd();

    //make sure path exists
    if (fs.existsSync(relativePath) === false) {
        console.error(`Directory at path not found: ${relativePath}`);
        return 1;
    }

    //get all tests based on filter and file extension
    var tests = glob.sync(path.join(relativePath, args.filter || "*"))
        .filter(x => path.extname(x).toLocaleLowerCase() === '.js')
        .map(x => { return { filepath: x, filename: path.basename(x), exitCode: null, error: null }; });

    //if domain is set, rewrite tests
    if (args.domain) {
        await handleDomain(tests, args.domain);
    }

    //execute
    const didSucceed = await runAllScriptsAsync(tests, args.errors || false);
    
    //cleanup
    if (args.domain) {
        await new Promise((resolve, reject) => {
            fs.rmSync('./.puppyteer', { recursive: true, force: true }, resolve);
        });
    }

    //handle result
    if (didSucceed === false) {
        if (core) {
            core.setFailed('One or more scripts failed');
        }
        return 1;
    }
    return 0;
}

module.exports = run;