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

    // Policy: Jaeger Secrets Retrieval Policy
    this.jaegerSecretsPolicy = new iam.ManagedPolicy(
      this,
      "JaegerSecretsPolicy",
      {
        managedPolicyName: "JaegerSecretsPolicy",
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
  }

  readonly argocdSecretsPolicy: iam.ManagedPolicy;
  readonly jaegerSecretsPolicy: iam.ManagedPolicy;
  readonly appSecretsPolicy: iam.ManagedPolicy;
}
