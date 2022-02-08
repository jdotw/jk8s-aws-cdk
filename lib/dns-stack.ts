import * as route53 from "aws-cdk-lib/aws-route53";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface DNSStackProps extends StackProps {
  hostedZoneName: string;
}
export class DNSStack extends Stack {
  constructor(scope: Construct, id: string, props: DNSStackProps) {
    super(scope, id, props);

    const { hostedZoneName } = props;

    // Zone
    this.zone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: hostedZoneName,
    });

    new cdk.CfnOutput(this, "HostedZoneName", {
      value: this.zone.zoneName,
      description: "HostedZoneName",
      exportName: "HostedZoneName",
    });
    new cdk.CfnOutput(this, "HostedZoneID", {
      value: this.zone.hostedZoneId,
      description: "HostedZoneID",
      exportName: "HostedZoneID",
    });

    // Policy: In-cluster manipulation of zone
    // This policy can be used by both external-dns and
    // cert-manager for DNS record inspection and manipulation
    this.clusterDNSPolicy = new iam.ManagedPolicy(this, "ClusterDNSPolicy", {
      managedPolicyName: "ClusterDNSPolicy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: [this.zone.hostedZoneArn],
          actions: [
            "route53:ChangeResourceRecordSets",
            "route53:ListResourceRecordSets",
          ],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ["*"],
          actions: ["route53:ListHostedZones", "route53:ListHostedZonesByName"],
        }),
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ["arn:aws:route53:::change/*"],
          actions: ["route53:GetChange"],
        }),
      ],
    });

    new cdk.CfnOutput(this, "ClusterDNSPolicyARN", {
      value: this.clusterDNSPolicy.managedPolicyArn,
      description: "Policy for in-cluster manipulation of Route53",
      exportName: "ClusterDNSPolicyARN",
    });
  }

  readonly zone: route53.PublicHostedZone;
  readonly clusterDNSPolicy: iam.ManagedPolicy;
}
