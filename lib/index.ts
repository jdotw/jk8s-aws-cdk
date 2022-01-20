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
    fqdn: config.fqdn,
  });

  const rds = new RDSStack(cdkApp, "RDSStack", {
    vpc,
  });

  const opensearch = new OpenSearchStack(cdkApp, "OpenSearchStack", { vpc });

  const cluster = new EKSStack(cdkApp, "EKSStack", {
    name,
    vpc,
    rds,
    opensearch,
  });

  const registry = new ECRStack(cdkApp, "ECRStack", {});

  new cdk.CfnOutput(cdkApp, "ClusterDNSPolicyARN", {
    value: dns.clusterDNSPolicy.managedPolicyArn,
    description: "Policy for in-cluster manipulation of Route53",
    exportName: "ClusterDNSPolicyARN",
  });
  new cdk.CfnOutput(cdkApp, "FQDN", {
    value: dns.zone.zoneName,
    description: "FQDN",
    exportName: "FQDN",
  });
  new cdk.CfnOutput(cdkApp, "ZoneID", {
    value: dns.zone.hostedZoneId,
    description: "ZoneID",
    exportName: "ZoneID",
  });

  new cdk.CfnOutput(cdkApp, "ArgoCDSecretsPolicyARN", {
    value: secrets.argocdSecretsPolicy.managedPolicyArn,
    description: "Policy for ArgoCD Secrets Retrieval",
    exportName: "ArgoCDSecretsPolicyARN",
  });
  new cdk.CfnOutput(cdkApp, "TelemetrySecretsPolicyARN", {
    value: secrets.telemetrySecretsPolicy.managedPolicyArn,
    description: "Policy for Telemetry Secrets Retrieval",
    exportName: "TelemetrySecretsPolicyARN",
  });
  new cdk.CfnOutput(cdkApp, "JaegerSecretsPolicyARN", {
    value: secrets.jaegerSecretsPolicy.managedPolicyArn,
    description: "Policy for Jaeger Secrets Retrieval",
    exportName: "JaegerSecretsPolicyARN",
  });
  new cdk.CfnOutput(cdkApp, "AppSecretsPolicyARN", {
    value: secrets.appSecretsPolicy.managedPolicyArn,
    description: "Policy for App Secrets Retrieval",
    exportName: "AppSecretsPolicyARN",
  });

  new cdk.CfnOutput(cdkApp, "RDSHost", {
    value: rds.db.instanceEndpoint.hostname,
  });
  new cdk.CfnOutput(cdkApp, "RDSSecretName", {
    value: rds.db.secret?.secretName!,
  });

  new cdk.CfnOutput(cdkApp, "ClusterARN", {
    value: cluster.cluster.clusterArn,
    description: "Cluster ARN",
    exportName: "ClusterARN",
  });
  new cdk.CfnOutput(cdkApp, "ClusterName", {
    value: cluster.cluster.clusterName,
    description: "Cluster Name",
    exportName: "ClusterName",
  });

  new cdk.CfnOutput(cdkApp, "ClusterStackName", {
    value: cluster.stackName,
    description: "Cluster Stack Name",
    exportName: "ClusterStackName",
  });

  new cdk.CfnOutput(cdkApp, "OpenSearchDomain", {
    value: opensearch.domain.domainEndpoint,
    description: "OpenSearch Domain",
    exportName: "OpenSearchDomain",
  });
  new cdk.CfnOutput(cdkApp, "MasterUserSecretName", {
    value: opensearch.domain.masterUserPassword?.toString()!,
    description: "OpenSearch Master User Secret Name",
    exportName: "MasterUserSecretName",
  });
  new cdk.CfnOutput(cdkApp, "MasterUserGeneratedPassword", {
    value: opensearch.domain.masterUserPassword?.toString()!,
    description: "OpenSearch Master User Generated Password",
    exportName: "MasterUserGeneratedPassword",
  });
}
