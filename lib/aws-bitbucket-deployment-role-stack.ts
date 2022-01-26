import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import {Effect, ManagedPolicy, PolicyStatement} from "@aws-cdk/aws-iam";

export interface AWSBitbucketDeploymentRoleStackProps extends cdk.StackProps {
  readonly workspace: string,
}
export class AWSBitbucketDeploymentRoleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AWSBitbucketDeploymentRoleStackProps) {
    super(scope, id, props);

    const bbFederatedPrincipal = `arn:aws:iam::${this.account}:oidc-provider/api.bitbucket.org/2.0/workspaces/${props.workspace}/pipelines-config/identity/oidc`;

    const deploymentRole = new iam.Role(this, 'CDKDeploymentRole', {
      roleName: `BitbucketCDKDeploymentRole-${props.workspace}`,
      assumedBy: new iam.FederatedPrincipal(bbFederatedPrincipal, {
        "IpAddress": {
          "aws:SourceIp": [
            "34.199.54.113/32",
            "34.232.25.90/32",
            "34.232.119.183/32",
            "34.236.25.177/32",
            "35.171.175.212/32",
            "52.54.90.98/32",
            "52.202.195.162/32",
            "52.203.14.55/32",
            "52.204.96.37/32",
            "34.218.156.209/32",
            "34.218.168.212/32",
            "52.41.219.63/32",
            "35.155.178.254/32",
            "35.160.177.10/32",
            "34.216.18.129/32",
            "3.216.235.48/32",
            "34.231.96.243/32",
            "44.199.3.254/32",
            "174.129.205.191/32",
            "44.199.127.226/32",
            "44.199.45.64/32",
            "3.221.151.112/32",
            "52.205.184.192/32",
            "52.72.137.240/32"
          ]
        }
      }, "sts:AssumeRoleWithWebIdentity")
    });

    // allow Read Only for EVERYTHING
    deploymentRole.addManagedPolicy(ManagedPolicy.fromManagedPolicyArn(this, 'ReadOnlyAccess', 'arn:aws:iam::aws:policy/ReadOnlyAccess'));

    // now allow pretty much everything else as long as via Cloudformation
    const deployViaCloudFormationStatement = new PolicyStatement({
      resources: ['*'],
      actions: ['*'],
      effect: Effect.ALLOW,
      conditions: {
        "ForAnyValue:StringEquals": {
          "aws:CalledVia": ["cloudformation.amazonaws.com"]
        }
      }
    });
    deploymentRole.addToPolicy(deployViaCloudFormationStatement);

    // we need this to allow cdk to bootstrap AND then upload artifacts to the bootstrap buckets (As long as they match this naming pattern!)
    const deployResourcesToCDKStagingStatement = new PolicyStatement({
      resources: ['arn:aws:s3:::cdk-*stagingbucket-*'],
      actions: [
        's3:*',
      ],
      effect: Effect.ALLOW
    });
    deploymentRole.addToPolicy(deployResourcesToCDKStagingStatement);

    // for CDK V2:
    const deployResourcesToCDKV2StagingStatement = new PolicyStatement({
      resources: ['arn:aws:s3:::cdk-hnb659fds-assets-*'],
      actions: [
        's3:*',
      ],
      effect: Effect.ALLOW
    });
    deploymentRole.addToPolicy(deployResourcesToCDKV2StagingStatement);

    const assumeCDKV2RolesStatement = new PolicyStatement({
      resources: [
        'arn:aws:iam::*:role/cdk-hnb659fds-*-role-*'
      ],
      actions: [
        'sts:AssumeRole',
        'iam:PassRole',
      ],
      effect: Effect.ALLOW
    });
    deploymentRole.addToPolicy(assumeCDKV2RolesStatement);

    // we need this to allow cdk to bootstrap AND then upload artifacts to the bootstrap buckets (As long as they match this naming pattern!)
    const deployCDKCloudFormationStackStatement = new PolicyStatement({
      resources: ['*'],
      actions: [
        'cloudformation:ValidateTemplate',
        'cloudformation:DescribeStacks',
        'cloudformation:CreateChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:ExecuteChangeSet',
        'cloudformation:DescribeStackEvents',
        'cloudformation:DeleteChangeSet',
        'cloudformation:GetTemplate',
      ],
      effect: Effect.ALLOW
    });
    deploymentRole.addToPolicy(deployCDKCloudFormationStackStatement);

    // Grant permission to put events
    const allowPutEventsStatement = new PolicyStatement({
      resources: [`arn:aws:events:${this.region}:${this.account}:event-bus/*`],
      actions: [
        'events:PutEvents',
      ],
      effect: Effect.ALLOW
    });
    deploymentRole.addToPolicy(allowPutEventsStatement);

  }
}
