import { Construct } from "constructs";
import { DNSStack } from "./dns-stack";
import { ECRStack } from "./ecr-stack";
import { EKSStack } from "./eks-stack";
import { OpenSearchStack } from "./opensearch-stack";
import { RDSStack } from "./rds-stack";
import { SecretsStack } from "./secrets-stack";
import { VPCStack } from "./vpc-stack";
import * as cdk from "aws-cdk-lib";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface JK8SAwsCdkProps {
  // Define construct properties here
  name: string;
  fqdn: string;
}

export class JK8SAwsCdk extends Construct {
  constructor(scope: Construct, id: string, props: JK8SAwsCdkProps) {
    super(scope, id);

    const { name, fqdn } = props;

    const vpc = new VPCStack(this, "VPCStack", {});

    const secrets = new SecretsStack(this, "SecretsStack", {});

    const dns = new DNSStack(this, "DNSStack", {
      fqdn,
    });

    const rds = new RDSStack(this, "RDSStack", {
      vpc,
    });

    const opensearch = new OpenSearchStack(this, "OpenSearchStack", { vpc });

    const cluster = new EKSStack(this, "EKSStack", {
      name,
      vpc,
      rds,
      opensearch,
    });

    const registry = new ECRStack(this, "ECRStack", {});

    new cdk.CfnOutput(this, "ArgoCDSecretsPolicyARN", {
      //      value: argocdSecretsPolicy.managedPolicyArn,
      value: "testARN",
      description: "Policy for ArgoCD Secrets Retrieval",
      exportName: "ArgoCDSecretsPolicyARN",
    });
  }
}
