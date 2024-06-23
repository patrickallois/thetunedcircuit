import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ThetunedcircuitStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const subDomain = "www.thetunedcircuit.com";
		const rootDomain = "thetunedcircuit.com";

		const rootDomainBucket = new cdk.aws_s3.Bucket(this, subDomain, {
			autoDeleteObjects: true,
			bucketName: subDomain,
			bucketKeyEnabled: true,
			encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		new cdk.aws_s3.Bucket(this, rootDomain, {
			autoDeleteObjects: true,
			bucketName: rootDomain,
			bucketKeyEnabled: true,
			encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			websiteRedirect: {
				hostName: subDomain,
			},
		});
		new cdk.aws_s3_deployment.BucketDeployment(this, "DeployWebsite", {
			sources: [cdk.aws_s3_deployment.Source.asset("./site")],
			destinationBucket: rootDomainBucket,
		});
	}
}
