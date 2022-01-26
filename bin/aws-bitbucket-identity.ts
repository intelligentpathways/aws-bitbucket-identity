#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import * as fs from "fs";

const workspaceEnvironment: string = (process.env.DEPLOY_ENVIRONMENT || 'default').toLowerCase();

const configJson = fs.readFileSync(`config/${workspaceEnvironment}.json`, 'utf8');
const config = JSON.parse(configJson);

import { AWSBitbucketStack } from '../lib/aws-bitbucket-stack';
import { AWSBitbucketDeploymentRoleStack} from "../lib/aws-bitbucket-deployment-role-stack";
import { AWSBitbucketDevopsDeploymentRoleStack} from "../lib/aws-bitbucket-devops-deployment-role-stack";

const app = new cdk.App();

//This stack gets created once per AWS account
new AWSBitbucketStack(app, 'AWSBitbucketStack', {
    stackName: `AWSBitbucketStack-${config.workspace.toString().replace('_','-')}`,
    bitBucketProviderUrl: config.identityProviderUrl,
    bitBucketClientIds: config.identityProviderAudiences,
    bitBucketOIDCThumbprints: config.identityProviderThumbprints,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});

new AWSBitbucketDeploymentRoleStack(app, 'AWSBitbucketDeploymentRoleStack', {
    stackName: `AWSBitbucketDeploymentRoleStack-${config.workspace.toString().replace('_','-')}`,
    workspace: config.workspace,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});


new AWSBitbucketDevopsDeploymentRoleStack(app, 'AWSBitbucketDevOpsDeploymentRoleStack', {
    stackName: `AWSBitbucketDevOpsDeploymentRoleStack-${config.workspace.toString().replace('_','-')}`,
    workspace: config.workspace,
    env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
    },
});


