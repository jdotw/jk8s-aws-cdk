import { Stack, StackProps } from "aws-cdk-lib";
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

export interface JK8SAwsCdkProps extends StackProps {
  // Define construct properties here
  name: string;
  fqdn: string;
}

export class JK8SAwsCdkStack extends Stack {
  constructor(scope: Construct, id: string, props: JK8SAwsCdkProps) {
    super(scope, id);

    const { name, fqdn } = props;

    const vpc = new VPCStack(scope, "VPCStack", {});

    const secrets = new SecretsStack(scope, "SecretsStack", {});

    const dns = new DNSStack(scope, "DNSStack", {
      fqdn,
    });

    const rds = new RDSStack(scope, "RDSStack", {
      vpc,
    });

    const opensearch = new OpenSearchStack(scope, "OpenSearchStack", { vpc });

    const cluster = new EKSStack(scope, "EKSStack", {
      name,
      vpc,
      rds,
      opensearch,
    });

    const registry = new ECRStack(scope, "ECRStack", {});

    new cdk.CfnOutput(scope, "ArgoCDSecretsPolicyARN", {
      //      value: argocdSecretsPolicy.managedPolicyArn,
      value: "testARN",
      description: "Policy for ArgoCD Secrets Retrieval",
      exportName: "ArgoCDSecretsPolicyARN",
    });
  }
}
