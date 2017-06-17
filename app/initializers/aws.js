/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* Licensed under the Amazon Software License (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*   http://aws.amazon.com/asl/
*
* or in the "license" file accompanying this file. This file is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, express or implied.
* See the License for the specific language governing permissions and limitations
* under the License.
*/
import Ember from 'ember';
/**
 * This initializer will intiialize the AWS SDK before
 * the application loads. In this initilaizer we:
 * 
 *  - Intiialize the AWS-SDK for JavaScript
 *  - Restore any previous sessions
 *  - Register application values for application services
 */

/* eslint no-undef: "off" */
const idPool = 		aws_cognito_identity_pool_id || '',
      /* eslint no-undef: "off" */
  	  userPoolId = 	aws_user_pools_id || '',
      /* eslint no-undef: "off" */
  	  appClientId = aws_user_pools_web_client_id || '',
      /* eslint no-undef: "off" */
  	  region = 		aws_cognito_region || 'us-east-1';

/**
 * This function is run wether we have a previous session or not
 * 
 * @param application - the application instance
 * @param logins - any logins we want to setup for cognito identities
 * @param token - Cognito User Pools token 
 */
const getCredentials = (application, logins, token, accessToken) => {
	let params = {
		'IdentityPoolId': idPool
	};
	if (logins) {
		params.Logins = logins;
	}
	// Add the User's Id Token to the Cognito credentials login map.
    window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials(params);
    window.AWS.config.credentials.get(function(err) {
      if (err) {
        Ember.Logger.error('credentials get error: ', err);
        application.advanceReadiness();
      } else {
          if (logins) {
            application.register('auth:session', window.AWS.config.credentials.data, {instantiate: false});
            application.register('auth:token', token, {instantiate: false});
            application.register('auth:accessToken', accessToken, {instantiate: false});
          }
          application.advanceReadiness();
      }
    });
};

/**
 * Ember initializer 
 * @param application - Ember application instance
 */
export function initialize(application) {
  // Defer the loading of our app until we intiialize the
  // AWS SDK and retrieve any user sessions
  application.deferReadiness();

  window.AWS.config.region = region;
  window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials({
	  'IdentityPoolId': idPool
  });

  // cognito user pool
  let poolData = { 
    'UserPoolId' : userPoolId, 
    'ClientId' : appClientId
  },
  userPool = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUserPool(poolData),
  cognitoUser = userPool.getCurrentUser();
  application.register('cognito:userPool', userPool, {instantiate:false});
  
// Check if a cognito user is already logged in from local storage
  if (cognitoUser !== null) {
    cognitoUser.getSession(function(err, result) {
      if (result) {
        application.register('cognito:user', cognitoUser, {instantiate:false});
        Ember.Logger.debug('You are logged in with Cognito User Pools: ', result);
        let login = 'cognito-idp.'+region+'.amazonaws.com/'+userPoolId, logins = {};
        logins[login] = result.getIdToken().getJwtToken();
        getCredentials(application, logins, result.getIdToken().getJwtToken(), result.getAccessToken().getJwtToken());
      } else {
        getCredentials(application);
      }
    });
  } else {
    getCredentials(application);
  }
}

export default {
  name: 'aws',
  initialize
};
