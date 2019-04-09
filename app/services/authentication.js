/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/

import Service from '@ember/service';
import { defer } from 'rsvp';
import { set } from '@ember/object';
import { inject } from '@ember/service';
import Ember from 'ember';
const { Logger } = Ember;
/**
 * The authentication service handles
 * storing the authentication session
 * and user pools token.
 */
export default Service.extend({
  cognito: inject(),
	/**
	 * set by the initializer if a previous
	 * session is present, otherwise set on login
	 **/
  authenticated: undefined,
  /** JWT Token */
  token: undefined,
  accessToken: undefined,
  service: undefined,
  getProfile: function () {
    let then = defer();
    if (typeof this.get('cognito').get('user') !== 'undefined') {
      this.get('cognito').getUserAttributes()
        .then(function (data) {
          Logger.debug('cognito profile data: ', data);
          var profile = {
            'attributes': data,
            'service': 'cognito'
          };
          then.resolve(profile);
        }, function (err) {
          then.reject(err);
        });
    }
    return then.promise;
  },
  logout: function () {
    let cognito = this.get('cognito'),
      then = defer(),
      auth = this;
    cognito.clearIdentity()
      .then(function () {
        set(auth, 'authenticated', false);
        then.resolve();
      }, function (error) {
        Logger.error(error);
        then.reject(error);
      });
    return then.promise;
  }
});
