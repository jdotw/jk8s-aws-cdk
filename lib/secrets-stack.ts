import * as route53 from "aws-cdk-lib/aws-route53";
import * as iam from "aws-cdk-lib/aws-iam";
import * as cdk from "aws-cdk-lib";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface SecretsStackProps extends StackProps {}
export class SecretsStack extends Stack {
  constructor(scope: Construct, id: string, props?: SecretsStackProps) {
    super(scope, id, props);

    // Policy: ArgoCD Secrets Retrieval Policy
    this.argocdSecretsPolicy = new iam.ManagedPolicy(
      this,
      "ArgoCDSecretsPolicy",
      {
        managedPolicyName: "ArgoCDSecretsPolicy",
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ["*"],
            actions: [
              "secretsmanager:GetResourcePolicy",
              "secretsmanager:GetSecretValue",
              "secretsmanager:DescribeSecret",
              "secretsmanager:ListSecretVersionIds",
            ],
          }),
        ],
      }
    );
    new cdk.CfnOutput(this, "ArgoCDSecretsPolicyARN", {
      value: this.argocdSecretsPolicy.managedPolicyArn,
      description: "Policy for ArgoCD Secrets Retrieval",
      exportName: "ArgoCDSecretsPolicyARN",
    });

    // Policy: Telemetry Secrets Retrieval Policy
    this.telemetrySecretsPolicy = new iam.ManagedPolicy(
      this,
      "TelemetrySecretsPolicy",
      {
        managedPolicyName: "TelemetrySecretsPolicy",
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ["*"],
            actions: [
              "secretsmanager:GetResourcePolicy",
              "secretsmanager:GetSecretValue",
              "secretsmanager:DescribeSecret",
              "secretsmanager:ListSecretVersionIds",
            ],
          }),
        ],
      }
    );
    new cdk.CfnOutput(this, "TelemetrySecretsPolicyARN", {
      value: this.telemetrySecretsPolicy.managedPolicyArn,
      description: "Policy for Telemetry Secrets Retrieval",
      exportName: "TelemetrySecretsPolicyARN",
    });

    // Policy: App Secrets Retrieval Policy
    this.appSecretsPolicy = new iam.ManagedPolicy(this, "AppSecretsPolicy", {
      managedPolicyName: "AppSecretsPolicy",
      statements: [
        new iam.PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ["*"],
          actions: [
            "secretsmanager:GetResourcePolicy",
            "secretsmanager:GetSecretValue",
            "secretsmanager:DescribeSecret",
            "secretsmanager:ListSecretVersionIds",
          ],
        }),
      ],
    });
    new cdk.CfnOutput(this, "AppSecretsPolicyARN", {
      value: this.appSecretsPolicy.managedPolicyArn,
      description: "Policy for App Secrets Retrieval",
      exportName: "AppSecretsPolicyARN",
    });

    // Policy: Crossplane Secrets Retrieval Policy
    this.crossplaneSecretsPolicy = new iam.ManagedPolicy(
      this,
      "CrossplaneSecretsPolicy",
      {
        managedPolicyName: "CrossplaneSecretsPolicy",
        statements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            resources: ["*"],
            actions: [
              "secretsmanager:GetResourcePolicy",
              "secretsmanager:GetSecretValue",
              "secretsmanager:DescribeSecret",
              "secretsmanager:ListSecretVersionIds",
            ],
          }),
        ],
      }
    );
    new cdk.CfnOutput(this, "CrossplaneSecretsPolicyARN", {
      value: this.crossplaneSecretsPolicy.managedPolicyArn,
      description: "Policy for Crossplane Secrets Retrieval",
      exportName: "CrossplaneSecretsPolicyARN",
    });
  }

  readonly argocdSecretsPolicy: iam.ManagedPolicy;
  readonly telemetrySecretsPolicy: iam.ManagedPolicy;
  readonly appSecretsPolicy: iam.ManagedPolicy;
  readonly crossplaneSecretsPolicy: iam.ManagedPolicy;
}
