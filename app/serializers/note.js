/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/
import JSONSerializer from 'ember-data/serializers/json';

export default JSONSerializer.extend({
	/*
	The primaryKey is used when serializing and deserializing data. 
	Ember Data always uses the id property to store the id of the record. 
	The external source may not always follow this convention. 
	In these cases it is useful to override the primaryKey property to 
	match the primaryKey of your external store.
	*/
	primaryKey: 'noteId',
	normalizeDeleteRecordResponse(store, primaryModelClass, payload, id, requestType) {
		payload = payload.Attributes;
  		return this._super(store, primaryModelClass, payload, id, requestType);
  	}
});
