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
import DS from 'ember-data';
import Ember from 'ember';

/* eslint no-undef: "off" */
const dynamodbConfig = aws_dynamodb_table_schemas;

export default DS.Adapter.extend({
    dynamodbClient: new window.AWS.DynamoDB.DocumentClient(),
	dynamodbTable: dynamodbConfig[0].tableName,
	cognito: Ember.inject.service(),
	generateId: function() {
    	var len = 16;
	    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	    var charLength = chars.length;
	    var result = "";
	    let randoms = window.crypto.getRandomValues(new Uint32Array(len));
	    for(var i = 0; i < len; i++) {
	      result += chars[randoms[i] % charLength];
	    }
	    return result.toLowerCase();
	},
	findAll: function() {
		let table = this.get('dynamodbTable'),
			client = this.get('dynamodbClient'),
			cognito = this.get('cognito'),
			identityId = cognito.get('id');
		return new Ember.RSVP.Promise(function(resolve,reject) {
			let queryParams = {
		      'TableName': table,
		      'IndexName': 'DateSorted',
		      'KeyConditionExpression': "#userId = :userId",
		      'ExpressionAttributeNames': {
		        '#userId': 'userId',
		      },
		      'ExpressionAttributeValues': {
		        ':userId': identityId
		      },
		      'ScanIndexForward': false
		    };
			client.query(queryParams, function(error, result) {
		    	if (error) {
					Ember.run(null, reject, error);
		    	} else {
					Ember.run(null, resolve, result.Items);
				}
			});
		});
	},
	createRecord: function(store, type, snapshot) {
		let table = this.get('dynamodbTable'),
			client = this.get('dynamodbClient'),
			cognito = this.get('cognito'),
			identityId = cognito.get('id'),
			item = this.serialize(snapshot, { includeId: true });
			item.noteId = this.generateId();
			item.userId = identityId;
			item.creationDate = new Date().getTime();
		return new Ember.RSVP.Promise(function(resolve,reject) {
			let putParams = {
	          'TableName': table,
	          'Item': item,
	          'ConditionExpression': 'attribute_not_exists(noteId)'
	        };
			client.put(putParams, function(error, result) {
				Ember.Logger.debug('api response: ', result);
				if (error) {
					Ember.run(null, reject, error);
				} else {
					Ember.run(null, resolve, item);
				}
			});
		});
	},
	updateRecord: function(store, type, snapshot) {
		let table = this.get('dynamodbTable'),
			client = this.get('dynamodbClient'),
			cognito = this.get('cognito'),
			identityId = cognito.get('id'),
			item = this.serialize(snapshot, { includeId: true });
		return new Ember.RSVP.Promise(function(resolve,reject) {
			var params = {
				TableName: table,
				Key: { 
					'userId' : identityId,
					'noteId' : item.noteId 
				},
				UpdateExpression: 'set #t = :t, #c = :c',
				ExpressionAttributeNames: {
					'#t' : 'title',
					'#c' : 'content'
				},
				ExpressionAttributeValues: {
				  ':t' : item.title,
				  ':c' : item.content
				}
			};
			client.update(params,function(error) {
				if (error) {
					Ember.run(null, reject, error);
				} else {
					Ember.run(null, resolve, item);
				}
			});
		});
	},
	deleteRecord: function(store, type, snapshot) {
		let table = this.get('dynamodbTable'),
			client = this.get('dynamodbClient'),
			cognito = this.get('cognito'),
			identityId = cognito.get('id'),
			item = this.serialize(snapshot, { includeId: true });
		return new Ember.RSVP.Promise(function(resolve,reject) {
			client.delete({
		      'TableName': table,
		      'Key': {
		        'userId': identityId,
		        'noteId': item.noteId
		      }
		    },function(error) {
				if (error) {
					Ember.run(null, reject, error);
				} else {
					Ember.run(null, resolve, item);
				}
			});
		});
	}
});
