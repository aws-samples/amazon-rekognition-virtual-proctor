## Amazon Rekognition Virtual Proctor

### Index

* [Architecture](#architecture)
* [Usage](#usage)
  * [Prerequisites](#prerequisites)
  * [Deployment](#deployment)
  * [Accessing the application](#accessing-the-application)
* [Remove the application](#remove-the-application)
* [Making changes to the code and customization](#making-changes-to-the-code-and-customization)
* [Contributing](#contributing)

### Architecture

TODO Diagram

### Usage

#### Prerequisites

To deploy the sample application you will require an AWS account. If you don’t already have an AWS account, create one at <https://aws.amazon.com> by following the on-screen instructions. Your access to the AWS account must have IAM permissions to launch AWS CloudFormation templates that create IAM roles.

To use the sample application you will require a [modern browser](https://caniuse.com/#feat=stream) and a webcam.

#### Deployment

The demo application is deployed as an [AWS CloudFormation](https://aws.amazon.com/cloudformation) template.

TODO (links)

2. If prompted, login using your AWS account credentials.
1. You should see a screen titled "*Create Stack*" at the "*Specify template*" step. The fields specifying the CloudFormation template are pre-populated. Click the *Next* button at the bottom of the page.
1. On the "*Specify stack details*" screen you may customize the following parameters of the CloudFormation stack:

   - **Stack Name:**  (Default: VirtualProctor) This is the name that is used to refer to
     this stack in CloudFormation once deployed.
   - **AdminEmail:** The email address you wish to setup as the initial user of this Amazon Rekognition Virtual Proctor deployment.
   - **CreateCloudFrontDistribution** (Default: true) Creates a CloudFront distribution for accessing the web interface of the solution.
   - **ResourcePrefix:** (Default: VirtualProctor) Resource prefix to apply to resource names when creating statically named resources.

   When completed, click *Next*
1. [Configure stack options](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-console-add-tags.html) if desired, then click *Next*.
1. On the review you screen, you must check the boxes for:
   * "*I acknowledge that AWS CloudFormation might create IAM resources*" 
   * "*I acknowledge that AWS CloudFormation might create IAM resources with custom names*" 

   These are required to allow CloudFormation to create a Role to allow access to resources needed by the stack and name the resources in a dynamic way.
1. Click *Create Change Set* 
1. On the *Change Set* screen, click *Execute* to launch your stack.
   * You may need to wait for the *Execution status* of the change set to become "*AVAILABLE*" before the "*Execute*" button becomes available.
1. Wait for the CloudFormation stack to launch. Completion is indicated when the "Stack status" is "*CREATE_COMPLETE*".
   * You can monitor the stack creation progress in the "Events" tab.
1. Note the *url* displayed in the *Outputs* tab for the stack. This is used to access the application.

#### Accessing the Application

The application is accessed using a web browser. The address is the *url* output from the CloudFormation stack created during the Deployment steps.

* When accessing the application, the browser will ask you the permission for using your camera. You will need to click "*Allow*" for the application to work.
* Click "*Add a new user*" if you wish to add new profiles.
* Click "*Start Rekognition*" to start the engine. The app will start displaying information about the recognized faces and will calibrate the meter.

### Remove the application

To remove the application open the AWS CloudFormation Console, click the Virtual Proctor project, right-click and select "*Delete Stack*". Your stack will take some time to be deleted. You can track its progress in the "Events" tab. When it is done, the status will change from DELETE_IN_PROGRESS" to "DELETE_COMPLETE". It will then disappear from the list.

### Making changes to the code and customization

The [contributing guidelines](CONTRIBUTING.md) contains some instructions about how to run the front-end locally and make changes to the back-end stack.

## Contributing

Contributions are more than welcome. Please read the [code of conduct](CODE_OF_CONDUCT.md) and the [contributing guidelines](CONTRIBUTING.md).

## License Summary

This library is licensed under the MIT-0 License. See the LICENSE file.
