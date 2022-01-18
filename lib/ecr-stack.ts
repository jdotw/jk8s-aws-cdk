import * as iam from "aws-cdk-lib/aws-iam";
import * as ecr from "aws-cdk-lib/aws-ecr";
import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";

export interface ECRStackProps extends StackProps {}
export class ECRStack extends Stack {
  constructor(scope: Construct, id: string, props?: ECRStackProps) {
    super(scope, id, props);

    const ecrUser = new iam.User(this, "ECRUser", {
      userName: "ecr",
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          "AmazonEC2ContainerRegistryPowerUser"
        ),
      ],
    });
  }
}
