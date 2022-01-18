import * as route53 from "aws-cdk-lib/aws-route53";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface DNSStackProps extends StackProps {
  fqdn: string;
}
export class DNSStack extends Stack {
  constructor(scope: Construct, id: string, props: DNSStackProps) {
    super(scope, id, props);

    const { fqdn } = props;

    // Zone
    this.zone = new route53.PublicHostedZone(this, "HostedZone", {
      zoneName: fqdn,
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
  }
  readonly zone: route53.PublicHostedZone;
  readonly clusterDNSPolicy: iam.ManagedPolicy;
}
