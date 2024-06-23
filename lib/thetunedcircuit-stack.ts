import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ThetunedcircuitStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const subDomain = "www.thetunedcircuit.com";
		const rootDomain = "thetunedcircuit.com";

		new cdk.aws_s3.Bucket(this, subDomain, {
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			bucketName: subDomain,
		});
		new cdk.aws_s3.Bucket(this, rootDomain, {
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			bucketName: rootDomain,
		});
	}
}
