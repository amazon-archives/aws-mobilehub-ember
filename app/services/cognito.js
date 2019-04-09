/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/
//import Ember from 'ember';

import Service from '@ember/service';
import { observer } from '@ember/object';
import { defer } from 'rsvp';
import { set } from '@ember/object';
import { inject } from '@ember/service';
/* eslint no-undef: "off" */
const idPool = aws_cognito_identity_pool_id || '';
const { Logger } = Ember;

/**
 * Handles and stores Cognito properties
 * and provides methods to interact with
 * Cognito User Pools and Identity
 */
export default Service.extend({
  authentication: inject(),
  notify: inject(),
  identity: undefined, 	// cognito credential data
  id: undefined, 			// cognito identity id
  userPool: undefined, 	// cognito user pool
  user: undefined, 		// cognito user (if logged in with user pools)
  attributes: undefined,	// cognito user attributes
  refresh(callback) {
    window.AWS.config.credentials.refresh(callback);
  },
  onUserUpdate: observer('user', function () {
    this.getUserAttributes();
  }),
  onVerifiedUpdate: observer('verified', function () {
    if (!this.get('verified')) {
      this.get('notify').show('Please verify your email address.');
    }
  }),
	/**
	 * Sets the identity token for a server
	 * @param service - service to set i.e. graph.facebook.com
	 * @param token - identity token from the provider
	 *
	 * @returns promise [ null || error ]
	 */
  setIdentity(service, token, access) {
    let then = defer(),
      cognito = this,
      user = this.get('user'),
      auth = this.get('authentication');
    window.AWS.config.credentials.params.Logins = {};
    window.AWS.config.credentials.params.Logins[service] = token;

    // if the aws initializer has already authenticated we don't need to do this again
    if (typeof user !== 'undefined') {
      Logger.info('Retrieving Temporary Credentials for Cognito User');
      let params = {
        'IdentityPoolId': idPool
      };
      window.AWS.config.credentials = new window.AWS.CognitoIdentityCredentials(params);
      window.AWS.config.credentials.get(function (err) {
        if (err) {
          Ember.Logger.error('credentials get error: ', err);
          then.reject(err);
        } else {
          set(cognito, 'id', window.AWS.config.credentials.data.IdentityId);
          set(cognito, 'identity', window.AWS.config.credentials.data);
          set(auth, 'token', token);
          set(auth, 'accessToken', access);
          then.resolve();
        }
      });
    } else if (service) {
      Logger.info('Retrieving Temporary Credentials');
      window.AWS.config.credentials.get(function (err) {
        if (err) {
          Logger.error(err);
          then.reject(err);
        } else {
          cognito.set('id', window.AWS.config.credentials.data.IdentityId);
          cognito.set('identity', window.AWS.config.credentials.data);
          then.resolve();
        }
      });
    }
    return then.promise;
  },
	/**
	 * Clears an identity from local cache and logs the user out
	 * @param service - optional service to define the service being used i.e. graph.facebook.com
	 * will use User Pools by default
	 *
	 * @returns promise [ result || error ]
	 */
  clearIdentity() {
    let then = defer(),
      user = this.get('user');
    if (typeof user !== 'undefined') {
      window.AWS.config.credentials.clearCachedId();
      window.AWS.config.credentials.params.expired = true;
      Logger.info('Logging out of User Pools');
      user.signOut();
      then.resolve();
    } else {
      then.reject(err);
    }
    return then.promise;
  },
	/**
	 * Update a Cognito User Pools user's attributes
	 * @param attributes [
	 *	  {
	 *		'Name': attributeName,
	 *		'Value': attributeValue
	 * 	  },
	 *    ...
	 * ]
	 *
	 * @returns promise [ result || error ]
	 */
  updateUserAttributes(attributes) {
    let then = defer(),
      cognitoUser = this.get('user'),
      attributeList = [];
    attributes.forEach(function (attribute) {
      var cognitoAttribute = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(attribute);
      attributeList.push(cognitoAttribute);
    });
    cognitoUser.updateAttributes(attributeList, function (err, result) {
      if (err) {
        then.reject(err);
      } else {
        then.resolve(result);
      }
    });
    return then.promise;
  },
	/**
	 * Retrieves the logged in Cognito User Pools user's attributes
	 *
	 * @returns promise [ error || data ]
	 */
  getUserAttributes() {
    let then = defer(),
      user = this.get('user'),
      that = this;
    user.getUserAttributes(function (err, result) {
      if (err) {
        Logger.debug('getUserAttributes error: ', err);
        then.reject(err);
      } else {
        let data = [];
        for (let i = result.length - 1; i >= 0; i--) {
          if (result[i].Name !== 'sub' && result[i].Name !== 'email_verified') {
            data.push(result[i]);
          } else if (result[i].Name === 'email_verified') {
            set(that, 'verified', result[i].Value);
          }
        }
        set(that, 'attributes', data);
        then.resolve(data);
      }
    });
    return then.promise;
  },
	/**
	 * Registers a user with Cognito User Pools
	 *
	 * @param username - String
	 * @param password - String
	 *
	 * @returns promise [ result || error ]
	 */
  register(email, username, password) {
    let userPool = this.get('userPool'),
      then = defer(),
      attributeList = [],
      dataEmail = {
        'Name': 'email',
        'Value': email
      },
      service = this,
      attributeEmail = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(dataEmail);
    attributeList.push(attributeEmail);
    userPool.signUp(username, password, attributeList, null, function (err, result) {
      if (err) {
        then.reject(err);
      } else {
        set(service, 'user', result.user);
        then.resolve(result);
      }
    });
    return then.promise;
  },
	/**
	 * Resend a confirmation code
	 * @param username - Cognito User Pools username
	 *
	 * @returns promise [ result || error ]
	 */
  resendConfirmation(username) {
    let then = defer(),
      userPool = this.get('userPool'),
      userData = {
        'Username': username,
        'Pool': userPool
      },
      cognitoUser = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.resendConfirmationCode(function (err, result) {
      if (err) {
        then.reject(err);
      } else {
        then.resolve(result);
      }
    });
    return then.promise;
  },
	/**
	 * Confirm a user account with the Confirmation code
	 * sent with Cognito User Pools
	 *
	 * @param username
	 * @param code
	 *
	 * returns promise [ result || error ]
	 */
  confirm(username, code) {
    let then = defer(),
      userPool = this.get('userPool'),
      userData = {
        'Username': username,
        'Pool': userPool
      },
      cognitoUser = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err, result) {
      if (err) {
        then.reject(err);
      } else {
        then.resolve(result);
      }
    });
    return then.promise;
  },
	/**
	 * Authenticate a user against Cognito User Pools
	 * @param username
	 * @param password
	 *
	 * @returns promise [ cognito user || error ]
	 */
  authenticate(username, password) {
    let then = defer(),
      authenticationData = {
        'Username': username,
        'Password': password,
      },
      authenticationDetails = new window.AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(authenticationData),
      userPool = this.get('userPool'),
      userData = {
        'Username': username,
        'Pool': userPool
      },
      cognitoUser = new window.AWSCognito.CognitoIdentityServiceProvider.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (/*result*/) {
        // reload and let the initializer set the session (keep everything in one place)
        return document.location.reload();
      },
      onFailure: function (err) {
        Logger.error('Authentication Error: ', err);
        then.reject(err);
      },
    });
    return then.promise;
  }
});
