/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/
import Ember from 'ember';
const { Logger } = Ember;

export function initialize(appInstance) {
  let cognito = appInstance.lookup('service:cognito'),
    userPool = appInstance.lookup('cognito:userPool'),
    auth = appInstance.lookup('service:authentication'),
    session = appInstance.lookup('auth:session'),
    user = appInstance.lookup('cognito:user'),
    token = appInstance.lookup('auth:token'),
    access = appInstance.lookup('auth:accessToken');

  // check if we have an initial user populated by user pools
  if (typeof user !== 'undefined') {
    cognito.set('user', user);
    Logger.info('Cognito User initialized: ', user);
  }

  // check if we have a previous session that we've logged in
  if (typeof session !== 'undefined') {
    cognito.set('id', session.IdentityId);
    cognito.set('identity', session);
    auth.set('authenticated', true);
  }

  if (typeof token !== 'undefined') {
    auth.set('token', token);
    auth.set('accessToken', access);
  }

  // if we have a user pool
  if (typeof userPool !== 'undefined') {
    cognito.set('userPool', userPool);
  }

}

export default {
  name: 'auth',
  initialize
};
