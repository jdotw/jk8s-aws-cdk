import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export interface Jk8SAwsCdkProps {
  // Define construct properties here
}

export class Jk8SAwsCdk extends Construct {

  constructor(scope: Construct, id: string, props: Jk8SAwsCdkProps = {}) {
    super(scope, id);

    // Define construct contents here

    // example resource
    // const queue = new sqs.Queue(this, 'Jk8SAwsCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
