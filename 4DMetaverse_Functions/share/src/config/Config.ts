let configFilePath: string = './envs/LocalConfig';
switch (process.env.ENV) {
    case 'local':
        configFilePath = './envs/LocalConfig';
        break;
    case 'develop':
        configFilePath = './envs/DevConfig';
        break;
}

export default require(configFilePath).default;