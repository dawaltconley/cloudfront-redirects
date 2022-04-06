import { promises as fsp } from 'fs';
import makeStack from './index.mjs';
import { CloudFormationClient, CreateStackCommand, UpdateStackCommand } from '@aws-sdk/client-cloudformation';

const mode = process.argv[2];

let [ config, stack ] = await Promise.all([
    fsp.readFile('config.json').then(JSON.parse),
    makeStack(),
]);

if (mode === '--file') {
    const stackFile = process.argv[3] || 'template.json';
    await fsp.writeFile(stackFile, JSON.stringify(stack, null, 2));
} else {
    const client = new CloudFormationClient({ region: 'us-east-1' });
    const commandInput = {
        StackName: config.StackName,
        TemplateBody: JSON.stringify(stack),
    };

    let command;
    if (mode === '--create') {
        command = new CreateStackCommand(commandInput);
    } else {
        command = new UpdateStackCommand(commandInput);
    }

    let result;
    try {
        result = await client.send(command);
    } catch (e) {
        console.error(e);
    }
    console.log(result);
}
