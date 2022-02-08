import { App, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { DNSStack } from "./dns-stack";
import { ECRStack } from "./ecr-stack";
import { EKSStack } from "./eks-stack";
import { OpenSearchStack } from "./opensearch-stack";
import { RDSStack } from "./rds-stack";
import { SecretsStack } from "./secrets-stack";
import { VPCStack } from "./vpc-stack";
import * as cdk from "aws-cdk-lib";
import { ClusterConfig } from "./config";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export function deployCluster(
  cdkApp: App,
  name: string,
  config: ClusterConfig
) {
  const vpc = new VPCStack(cdkApp, "VPCStack", {});

  const secrets = new SecretsStack(cdkApp, "SecretsStack", {});

  const dns = new DNSStack(cdkApp, "DNSStack", {
    hostedZoneName: config.hostedZoneName,
  });

  const rds = new RDSStack(cdkApp, "RDSStack", {
    vpc,
  });

  const opensearch = new OpenSearchStack(cdkApp, "OpenSearchStack", { vpc });

  const cluster = new EKSStack(cdkApp, "EKSStack", {
    config,
    name,
    vpc,
    rds,
    opensearch,
  });

  const registry = new ECRStack(cdkApp, "ECRStack", {});
}
