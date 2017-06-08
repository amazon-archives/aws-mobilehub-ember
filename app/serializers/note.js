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
