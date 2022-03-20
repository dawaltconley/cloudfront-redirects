import * as fs from 'fs';
import * as path from 'path';
import { globbySync } from 'globby';

const functions = globbySync('functions/*.js').map(file => ({
    name: path.parse(file).name,
    code: fs.readFileSync(file).toString(),
}));

const stack = {
    AWSTemplateFormatVersion: '2010-09-09',
    Description: 'Controls URL cleaning and subdomain redirection.',
    Resources: functions.reduce((obj, {name, code}) => ({
        ...obj,
        [name]: {
            Type: 'AWS::CloudFront::Function',
            Properties: {
                Name: name,
                AutoPublish: true,
                FunctionConfig: {
                    Comment: '',
                    Runtime: 'cloudfront-js-1.0',
                },
                FunctionCode: code,
            },
        },
    }), {}),
    Outputs: functions.reduce((obj, {name}) => ({
        ...obj,
        [name + 'Arn']: {
            Value: { 'Fn::GetAtt': `${name}.FunctionMetadata.FunctionARN`, },
            Export: { 
                Name: { 'Fn::Sub': '${AWS::StackName}-' + name },
            },
        },
    }), {}),
};

fs.writeFileSync('template.json', JSON.stringify(stack, null, 2));
