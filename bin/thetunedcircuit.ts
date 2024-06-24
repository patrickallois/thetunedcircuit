#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ThetunedcircuitStack } from '../lib/thetunedcircuit-stack';

const app = new cdk.App();
new ThetunedcircuitStack(app, 'ThetunedcircuitStack', {
	env: {
		account: process.env.CDK_DEFAULT_ACCOUNT,
		region: process.env.CDK_DEFAULT_REGION,
	},
});
