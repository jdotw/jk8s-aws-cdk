import { App } from "aws-cdk-lib";
import { DNSStack } from "./dns-stack";
import { ECRStack } from "./ecr-stack";
import { EKSStack } from "./eks-stack";
import { OpenSearchStack } from "./opensearch-stack";
import { RDSStack } from "./rds-stack";
import { SecretsStack } from "./secrets-stack";
import { VPCStack } from "./vpc-stack";
import { ClusterConfig } from "./config";

export type Cluster = {
  vpc: VPCStack;
  secrets: SecretsStack;
  dns: DNSStack;
  rds: RDSStack;
  opensearch: OpenSearchStack;
  eks: EKSStack;
  registry: ECRStack;
};

export const deployCluster = (
  cdkApp: App,
  name: string,
  config: ClusterConfig
): Cluster => {
  const vpc = new VPCStack(cdkApp, "VPCStack", {});

  const secrets = new SecretsStack(cdkApp, "SecretsStack", {});

  const dns = new DNSStack(cdkApp, "DNSStack", {
    hostedZoneName: config.hostedZoneName,
  });

  const rds = new RDSStack(cdkApp, "RDSStack", {
    vpc,
  });

  const opensearch = new OpenSearchStack(cdkApp, "OpenSearchStack", { vpc });

  const eks = new EKSStack(cdkApp, "EKSStack", {
    config,
    name,
    vpc,
    rds,
    opensearch,
  });

  const registry = new ECRStack(cdkApp, "ECRStack", {});

  return {
    vpc,
    secrets,
    dns,
    rds,
    opensearch,
    eks,
    registry,
  };
};
