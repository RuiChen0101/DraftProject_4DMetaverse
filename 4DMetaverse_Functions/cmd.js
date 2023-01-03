// This script only work with linux shell
import { spawn } from 'child_process';
import firebaseConfig from './firebase.json' assert {type: "json"};

const exec = (command) => {
    const splitCommand = command.split(' ');
    const argv = splitCommand.slice(1);
    return new Promise((resolve, reject) => {
        console.log(`=====> ${command}`)
        const child = spawn(splitCommand[0], argv);
        child.stdout.setEncoding('utf8').on('data', (chunk) => {
            process.stdout.write(chunk);
        });
        child.on('close', (code) => {
            resolve();
        });
    });
}

const buildCommand = (source, cmd) => {
    switch (process.platform) {
        case 'win32':
            return `cmd /c npm --prefix ./${source}/ run ${cmd}`;
        default:
            return `npm --prefix ./${source}/ run ${cmd}`;
    }
}

const main = async () => {
    const cmd = process.argv[2]
    const codebases = firebaseConfig.functions;
    const promiseList = [];
    for (const codebase of codebases) {
        promiseList.push(exec(buildCommand(codebase.source, cmd)));
    }
    await Promise.all(promiseList);
}

await main();
