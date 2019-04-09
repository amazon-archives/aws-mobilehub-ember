/*
* Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
* SPDX-License-Identifier: MIT-0
*/
import DS from 'ember-data';
import attr from 'ember-data/attr';

export default DS.Model.extend({
	userId: attr('string'),
	noteId: attr('string'),
	content: attr('string'),
	creationDate: attr('number'),
	title: attr('string'),
	pending: attr('boolean')
});
