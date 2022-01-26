import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';

export interface AWSBitbucketStackProps extends cdk.StackProps {
  readonly bitBucketProviderUrl: string,
  readonly bitBucketClientIds: string[]
  readonly bitBucketOIDCThumbprints?: string[]
}
export class AWSBitbucketStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: AWSBitbucketStackProps) {
    super(scope, id, props);

    const provider = new iam.OpenIdConnectProvider(this, 'BitBucketProvider', {
      url: props.bitBucketProviderUrl,
      clientIds: props.bitBucketClientIds,
      thumbprints: props.bitBucketOIDCThumbprints
    });
  }
}
