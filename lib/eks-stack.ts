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
import { capitalizeFirst } from "./utils";

export interface EKSStackProps extends StackProps {
  name: string;
  vpc: VPCStack;
  rds: RDSStack;
  opensearch: OpenSearchStack;
}
export class EKSStack extends Stack {
  constructor(scope: Construct, id: string, props: EKSStackProps) {
    super(scope, id, props);

    const { name, rds, vpc, opensearch } = props;

    // EKS Cluster

    const clusterAdmin = new iam.Role(this, "AdminRole", {
      assumedBy: new iam.AccountRootPrincipal(),
    });

    this.cluster = new eks.Cluster(this, `${capitalizeFirst(name)}`, {
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

    const nodeGroup = this.cluster.addNodegroupCapacity(`DefaultNodeGroup`, {
      instanceTypes: [new ec2.InstanceType("t3.medium")],
      minSize: 1,
      desiredSize: 3,
      maxSize: 5,
    });

    rds.db.connections.allowFrom(this.cluster, ec2.Port.tcp(5432));

    opensearch.opensearch.connections.allowFrom(
      this.cluster,
      ec2.Port.tcp(443)
    );
  }

  readonly cluster: eks.Cluster;
}
