var express = require('express');
var router = express.Router();
var IdeaModel = require('../model/idea');
var UserModel = require('../model/user');
var ResourceModel = require('../model/resource');
var TeamModel = require('../model/team');
var VoteModel = require('../model/vote');
var ObjectId = require('mongoose').Types.ObjectId;


/* GET ideas listing. */
router.get('/summary/:userId', function (req, res, next) {
    var response = {"myIdea": {"approved": 1, "new": 2, "review": 5, "rejected": 8}, "ideaSummary": {"total": 70, "participants": 200, "approved": 15, "new": 80, "review": 25, "rejected": 38},
        "topIdeas": [{"_id": "1", "title": "Title 1", "totalPoints": 50}, {"_id": "2", "title": "Title 2", "totalPoints": 40}, {"_id": "3", "title": "Title 3", "totalPoints": 50}, {"_id": "4", "title": "Title 4", "totalPoints": 60}, {"_id": "5", "title": "Title 5", "totalPoints": 70}]};
    res.send(response);
});

module.exports = router;