var express = require('express');
var router = express.Router();

module.exports = function(){

    router.route('/serviceInitial')
        .get(function (req, res, next) {
            var dataInitial = {
               // message: 'message',
                urltype: '1',
                tableContent: [
                    {
                        referenceNumber: '1',
                        status: 'enable',
                        workitemName: 'workitem',
                        taskType: 'task Type',
                        organizationName: 'super',
                        createdBy: 'user',
                        createdDate: '2014/02/03',
                        dealerType: 'dealer type'
                    },
                    {
                        referenceNumber: '2',
                        status: 'disable',
                        workitemName: 'test',
                        taskType: 'task Type',
                        organizationName: 'super',
                        createdBy: 'user',
                        createdDate: '2014/02/03',
                        dealerType: 'dealer type'
                    },
                    {
                        referenceNumber: '3',
                        status: 'disable',
                        workitemName: 'test',
                        taskType: 'task Type',
                        organizationName: 'super',
                        createdBy: 'user',
                        createdDate: '2014/02/03',
                        dealerType: 'dealer type'
                    }
                ],
                testBoolean: false,
                title: 'some'
            };
            res.status(200).send(dataInitial);
        });

    return router;
};