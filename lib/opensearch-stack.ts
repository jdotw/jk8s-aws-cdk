import { Stack, StackProps } from "aws-cdk-lib";
import * as cdk from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as opensearch from "aws-cdk-lib/aws-opensearchservice";
import { Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";
import { DatabaseInstance } from "aws-cdk-lib/aws-rds";
import { VPCStack } from "./vpc-stack";

export interface OpenSearchStackProps extends StackProps {
  vpc: VPCStack;
}
export class OpenSearchStack extends Stack {
  constructor(scope: Construct, id: string, props?: OpenSearchStackProps) {
    super(scope, id, props);

    const { vpc } = props!;

    const domain = new opensearch.Domain(this, "Domain", {
      version: opensearch.EngineVersion.OPENSEARCH_1_0,
      capacity: {
        masterNodes: 3,
        masterNodeInstanceType: "t3.small.search",
        dataNodes: 2,
        dataNodeInstanceType: "t3.small.search",
      },
      ebs: {
        volumeSize: 20,
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
        slowIndexLogEnabled: true,
      },
      enforceHttps: true,
      nodeToNodeEncryption: true,
      encryptionAtRest: {
        enabled: true,
      },
      fineGrainedAccessControl: {
        masterUserName: "master-user",
      },
      vpc: vpc.vpc,
      zoneAwareness: {
        enabled: true,
      },
    });
    this.opensearch = domain;

    new cdk.CfnOutput(this, "OpenSearchDomain", {
      value: domain.domainEndpoint,
      description: "OpenSearch Domain",
      exportName: "OpenSearchDomain",
    });

    new cdk.CfnOutput(this, "MasterUserSecretName", {
      value: domain.masterUserPassword?.toString()!,
      description: "OpenSearch Master User Secret Name",
      exportName: "MasterUserSecretName",
    });

    new cdk.CfnOutput(this, "MasterUserGeneratedPassword", {
      value: domain.masterUserPassword?.toString()!,
      description: "OpenSearch Master User Generated Password",
      exportName: "MasterUserGeneratedPassword",
    });
  }

  readonly opensearch: opensearch.Domain;
}
