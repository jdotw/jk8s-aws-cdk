import * as iam from "aws-cdk-lib/aws-iam";
import * as eks from "aws-cdk-lib/aws-eks";
import * as ecr from "aws-cdk-lib/aws-ecr";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RDSStack } from "./rds-stack";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { DNSStack } from "./dns-stack";
import { VPCStack } from "./vpc-stack";
import { OpenSearchStack } from "./opensearch-stack";
import { ClusterConfig } from "../lib/config";

export interface EKSStackProps extends StackProps {
  config: ClusterConfig;
  name: string;
  vpc: VPCStack;
  rds: RDSStack;
  opensearch: OpenSearchStack;
}
export class EKSStack extends Stack {
  constructor(scope: Construct, id: string, props: EKSStackProps) {
    super(scope, id, props);

    const { config, name, rds, vpc, opensearch } = props;

    // EKS Cluster

    const clusterAdmin = new iam.Role(this, "AdminRole", {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    this.cluster = new eks.Cluster(this, "Cluster", {
      vpc: vpc.vpc,
      vpcSubnets: [
        {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_WITH_NAT,
        },
      ],
      clusterName: name,
      mastersRole: clusterAdmin,
      version: eks.KubernetesVersion.V1_21,
      defaultCapacity: 0,
    });

    const nodeGroup = this.cluster.addNodegroupCapacity(`DefaultNodeGroup`, {
      instanceTypes: config.eksInstanceTypes.map(
        (t) => new ec2.InstanceType(t)
      ),
      minSize: config.eksMinNodeCount,
      desiredSize: config.eksDesiredNodeCount,
      maxSize: config.eksMaxNodeCount,
    });

    rds.db.connections.allowFrom(this.cluster, ec2.Port.tcp(5432));
    opensearch.domain.connections.allowFrom(this.cluster, ec2.Port.tcp(443));

    new cdk.CfnOutput(this, "ClusterARN", {
      value: this.cluster.clusterArn,
      description: "Cluster ARN",
      exportName: "ClusterARN",
    });
    new cdk.CfnOutput(this, "ClusterName", {
      value: this.cluster.clusterName,
      description: "Cluster Name",
      exportName: "ClusterName",
    });

    new cdk.CfnOutput(this, "ClusterStackName", {
      value: this.stackName,
      description: "Cluster Stack Name",
      exportName: "ClusterStackName",
    });
  }

  readonly cluster: eks.Cluster;
}
