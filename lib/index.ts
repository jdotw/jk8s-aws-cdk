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

    new cdk.CfnOutput(this, "ClusterDNSPolicyARN", {
      value: dns.clusterDNSPolicy.managedPolicyArn,
      description: "Policy for in-cluster manipulation of Route53",
      exportName: "ClusterDNSPolicyARN",
    });
    new cdk.CfnOutput(this, "FQDN", {
      value: dns.zone.zoneName,
      description: "FQDN",
      exportName: "FQDN",
    });
    new cdk.CfnOutput(this, "ZoneID", {
      value: dns.zone.hostedZoneId,
      description: "ZoneID",
      exportName: "ZoneID",
    });

    new cdk.CfnOutput(this, "ArgoCDSecretsPolicyARN", {
      value: secrets.argocdSecretsPolicy.managedPolicyArn,
      description: "Policy for ArgoCD Secrets Retrieval",
      exportName: "ArgoCDSecretsPolicyARN",
    });
    new cdk.CfnOutput(this, "JaegerSecretsPolicyARN", {
      value: secrets.jaegerSecretsPolicy.managedPolicyArn,
      description: "Policy for Jaeger Secrets Retrieval",
      exportName: "JaegerSecretsPolicyARN",
    });
    new cdk.CfnOutput(this, "AppSecretsPolicyARN", {
      value: secrets.appSecretsPolicy.managedPolicyArn,
      description: "Policy for App Secrets Retrieval",
      exportName: "AppSecretsPolicyARN",
    });

    new cdk.CfnOutput(this, "RDSHost", {
      value: rds.db.instanceEndpoint.hostname,
    });
    new cdk.CfnOutput(this, "RDSSecretName", {
      value: rds.db.secret?.secretName!,
    });

    new cdk.CfnOutput(this, "ClusterARN", {
      value: cluster.cluster.clusterArn,
      description: "Cluster ARN",
      exportName: "ClusterARN",
    });
    new cdk.CfnOutput(this, "ClusterName", {
      value: cluster.cluster.clusterName,
      description: "Cluster Name",
      exportName: "ClusterName",
    });

    new cdk.CfnOutput(this, "ClusterStackName", {
      value: cluster.stackName,
      description: "Cluster Stack Name",
      exportName: "ClusterStackName",
    });

    new cdk.CfnOutput(this, "OpenSearchDomain", {
      value: opensearch.domain.domainEndpoint,
      description: "OpenSearch Domain",
      exportName: "OpenSearchDomain",
    });
    new cdk.CfnOutput(this, "MasterUserSecretName", {
      value: opensearch.domain.masterUserPassword?.toString()!,
      description: "OpenSearch Master User Secret Name",
      exportName: "MasterUserSecretName",
    });
    new cdk.CfnOutput(this, "MasterUserGeneratedPassword", {
      value: opensearch.domain.masterUserPassword?.toString()!,
      description: "OpenSearch Master User Generated Password",
      exportName: "MasterUserGeneratedPassword",
    });
  }
}
