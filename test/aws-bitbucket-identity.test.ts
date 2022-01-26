import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AWSBitbucket from '../lib/aws-bitbucket-stack';

test('BitbucketAWSStack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new AWSBitbucket.AWSBitbucketStack(app, 'MyTestStack', {
        bitBucketClientIds: ['ari:cloud:bitbucket::workspace/<enter your workspace name in lowercase here>'],
        bitBucketProviderUrl: 'https://api.bitbucket.org/2.0/workspaces/<enter your workspace name in lowercase here>/pipelines-config/identity/oidc'
    });
    console.log(stack.templateFile);
    // THEN
    expectCDK(stack).to(haveResource("Custom::AWSCDKOpenIdConnectProvider"));
});
