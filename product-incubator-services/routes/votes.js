var express = require('express');
var router = express.Router();
var VoteModel = require('../model/vote');
var IdeaModel = require('../model/idea');
var UserModel = require('../model/user');

/* GET ideas listing. */
router.get('/', function (req, res, next) {
    var idea = req.query.idea;
    var user = req.query.user;
    console.log('idea id for finding vote: ' + idea);
   
    if (idea && user) {
        VoteModel.findOne({idea: idea, votedBy: user}, function (err, vote) {
            if (err) {
                console.log('Error ' + err);
                res.status(404).send('Not found');
            } else {
                res.send(vote);
            }
        });

        return;
    }
    var response = {};
    console.log('votes is called');
    //res.send({"result":"OK"});
    VoteModel.find({}, function (err, result) {
        if (err) {
            console.error(err.stack);
            next(err);
        } else {
            response = result;
        }
        res.send(response);
    });
});
/* GET ideas by Id */
router.get('/:id', function (req, res) {

    console.log('vote is called' + req.params.id);
    //find the idea by ID

    VoteModel.findById(req.params.id, function (err, result) {
        if (err) {
            console.log('Error ' + err);
            res.status(404).send('Not found');
        } else {
            res.send(result);
        }
    });
});

//POST to create an Idea
router.post('/', function (req, res, next) {
    // Get our REST or form values. These rely on the "name" attributes
    console.log('POST to create an resource is called');
    var vote = VoteModel({
        idea: req.body.idea,
        comment: req.body.comment,
        rating: req.body.rating,
        votedBy: req.body.votedBy,
        createdDate: Date.now()});
    vote.save(function (err, result) {
        if (err) {
            console.log("Error" + err);
            res.send("There was a problem updating the information to the database: " + err);
            return;
        }
        if (req.body.rating) {
            updateIdea(req.body.idea, req.body.rating || 0, next);
        }
        console.log('Vote created!' + result);
        res.send(result);
    });
});
//PUT to update an Idea by ID
router.put('/:id', function (req, res, next) {
    console.log('update id' + req.params.id);
    //find the idea by ID  
    VoteModel.findOne({_id: req.params.id}, function (err, vote) {
        if (err) {
            console.log('Error in Idea update!' + err);
            res.send("There was a problem updating the information to the database: " + err);
            return;
        }
        //update it
        console.log('Found vote for' + req.params.id);
        console.log(vote);
        vote.update({
            comment: req.body.comment || vote.comment,
            rating: req.body.rating || vote.rating
        }, function (err, result) {
            if (err) {
                console.log('Error in resource update!' + err);
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                updateIdea(req.body.idea, req.body.rating || 0, next);
                console.log('resource updated!' + JSON.stringify(result));
                res.format({
                    //JSON responds showing the updated values
                    json: function () {
                        res.json(result);
                    }
                });
            }
        });
        console.log('Vote updated!');
    });
});
//DELETE all
router.delete('/', function (req, res) {

    console.log('DELETE...All');
    VoteModel.remove({}, function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
//DELETE a vote by ID
router.delete('/:id', function (req, res) {
    //find emp by ID
    console.log('delete id:' + req.params.id);
    VoteModel.findById(req.params.id, function (err, vote) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            vote.remove(function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + result._id);
                    res.format({
                        //JSON returns the item with the message that is has been deleted
                        json: function () {
                            res.json({message: 'deleted',
                                item: result
                            });
                        }
                    });
                }
            });
        }
    });
    console.log('Vote deleted!');
});

function updateIdea(ideaId, rating, next) {
    IdeaModel.findOne({_id: ideaId}, function (err, idea) {
        if (err) {
            console.log('Error in Idea update!' + err);
            res.send("There was a problem updating the information to the database: " + err);
            return;
        }
        //update it
        console.log('Found idea for' + ideaId);
        console.log(idea);
        idea.update({
            totalPoints: idea.totalPoints + rating
        }, function (err, result) {
            if (err) {
                next(err);
            } else {
                console.log('Idea updated!' + JSON.stringify(result));

            }
        });
    });
}
module.exports = router;
