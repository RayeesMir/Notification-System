'use strict';
var path=require('path');

var ActivitiesCtrl = require(path.resolve('./app/controllers/activity'));

module.exports = function(app) {

  app.post('/api/activity', ActivitiesCtrl.addActivity);

  app.get('/api/activity', ActivitiesCtrl.getActivities);

};