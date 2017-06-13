
![AWS Architecture Diagram](architecture.png "AWS Architecture")

# EmberJS Serverless Web Application

A serverless web application built with EmberJS using AWS MobileHub import/export functionality. 
This web app utilizes AWS MobileHub for it's backend and the MobileHub generated `aws-config.js`
for connection properties.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/) (for tests)
* [AWS CLI](https://aws.amazon.com/cli)

## Setup and AWS MobileHub import
Import the provided MobileHub.zip file into AWS MobileHub:

1. Navigate to the AWS Mobilehub console 
2. Import the `MobileHub.zip` file included in this repo. Click **Import Project**
3. Once the import is complete, click on **Hosting and Streaming**, then **Manage Files** copy/note the Amazon S3 > **your-s3-bucket** at the top of the page
4. Fork this repo, then, in the root of your cloned project directory run (replace "your-s3-bucket" with the bucket created by MobileHub)

* `git clone https://github.com/awslabs/aws-serverless-ember -b mobilehub`
* `aws s3 cp s3://your-bucket/aws-config.js ./vendor/aws-config.js`
* `aws s3 cp s3://your-bucket/aws-sdk.min.js ./vendor/aws-sdk.min.js`
* `npm install`
* `ember serve`

* Visit your app at [http://localhost:4200](http://localhost:4200).

## Updating from Mobile Hub

If you update your AWS backend, after updating the AWS Mobile Hub configuration, run (from the root of your project):

    aws s3 cp s3://your-bucket/aws-config.js ./vendor/aws-config.js

This will download the new `aws-config.js` file with the new configuration values. No update 
to the app should be neccisary unless you added new functionality. In that case even,
you can simply refer to the new constants within the Ember app.

### Ember Code Generators and Adapters

Make use of the many generators in Ember.js for your code, try `ember help generate` for more details. This app comes
with a pre-built adapter for DynamoDB, located in app/adapters. This adapter abstracts the DynamoDB backend logic so
that within your controllers you can work with Ember models.

 - app/adapters/note.js 				-> Ember adapter for interacting with DynamoDB
 - app/serializers/node.js 				-> Serializes data returned from AWS APIs for Ember model data
 - app/models/note.js 					-> Ember model for our DynamoDB items
 - app/initializers/aws.js 				-> AWS JS SDK bootstrap and initialization
 - app/instance-initializers/auth.js 	-> Injection of Cognito resources (authenticated user) into Ember services
 - app/services/cognito.js 				-> Amazon Cognito Ember service

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying to S3

To deploy the app to your MobileHub generated S3 hosting bucket, use the S3 bucket name obtained above, and simply run from your
projects root directory: 

    ember build
    aws s3 cp ./dist s3://your-s3-bucket/ --recursive --acl public-read

Then visit your S3 static web hosts url. To retrieve this:

1. Goto MobileHub and click on **Hosting and Streaming**
2. Click on **manage** 
3. Click on **Properties** -> ***Static website hosting***
4. Use the **Endpoint** displayed

NOTE: If you would like browser URLs to route directly to your Ember routes e.g. visiting http://your-s3-host/home etc. You should add
"index.html" to the **Error document** as well.

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
