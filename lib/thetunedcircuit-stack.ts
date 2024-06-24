import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";

export class ThetunedcircuitStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const subDomain = "www.thetunedcircuit.com";
		const rootDomain = "thetunedcircuit.com";

		const subDomainBucket = new cdk.aws_s3.Bucket(this, subDomain, {
			autoDeleteObjects: true,
			bucketName: subDomain,
			bucketKeyEnabled: true,
			encryption: cdk.aws_s3.BucketEncryption.S3_MANAGED,
			removalPolicy: cdk.RemovalPolicy.DESTROY,
		});
		const rootDomainBucket = new cdk.aws_s3.Bucket(this, rootDomain, {
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
			destinationBucket: subDomainBucket,
		});

		const certificate = new cdk.aws_certificatemanager.Certificate(
			this,
			"Certificate",
			{
				domainName: rootDomain,
				keyAlgorithm: cdk.aws_certificatemanager.KeyAlgorithm.RSA_2048,
				validation: cdk.aws_certificatemanager.CertificateValidation.fromDns(),
				subjectAlternativeNames: [rootDomain, `*.${rootDomain}`],
			}
		);

		const subDomainDistribution = new cdk.aws_cloudfront.Distribution(
			this,
			"SubDomainDistribution",
			{
				certificate: certificate,
				defaultBehavior: {
					origin: new cdk.aws_cloudfront_origins.S3Origin(subDomainBucket),
					viewerProtocolPolicy:
						cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
				defaultRootObject: "index.html",
				domainNames: [subDomain],
			}
		);

		const rootDomainDistribution = new cdk.aws_cloudfront.Distribution(
			this,
			"RootDomainDistribution",
			{
				certificate: certificate,
				defaultBehavior: {
					origin: new cdk.aws_cloudfront_origins.S3Origin(rootDomainBucket),
					viewerProtocolPolicy:
						cdk.aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
				},
				defaultRootObject: "index.html",
				domainNames: [rootDomain],
			}
		);
	}
}
