import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import {ManagedPolicy} from "@aws-cdk/aws-iam";

export interface AWSBitbucketDevOpsDeploymentRoleStackProps extends cdk.StackProps {
  readonly workspace: string,
}
export class AWSBitbucketDevopsDeploymentRoleStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AWSBitbucketDevOpsDeploymentRoleStackProps) {
    super(scope, id, props);

    const bbFederatedPrincipal = `arn:aws:iam::${this.account}:oidc-provider/api.bitbucket.org/2.0/workspaces/${props.workspace}/pipelines-config/identity/oidc`;

    const deploymentRole = new iam.Role(this, 'DevOpsReadOnlyRole', {
      roleName: `BitbucketDevOpsReadOnlyRole-${props.workspace}`,
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


  }
}
