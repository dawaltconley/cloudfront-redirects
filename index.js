import { promises as fsp } from 'fs';
import * as path from 'path';
import { globby } from 'globby';

export default async () => {
    let functions = await globby('functions/*.js');
    functions = functions.map(async file => {
        const name = path.parse(file).name;
        const code = (await fsp.readFile(file)).toString();
        return { name, code };
    });
    functions = await Promise.all(functions);

    return {
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
};
