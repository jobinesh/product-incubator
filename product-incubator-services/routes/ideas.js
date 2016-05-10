var express = require('express');
var router = express.Router({mergeParams: true});
var IdeaModel = require('../model/idea');
var UserModel = require('../model/user');
var ResourceModel = require('../model/resource');
var TeamModel = require('../model/team');
var VoteModel = require('../model/vote');
var ObjectId = require('mongoose').Types.ObjectId;

/* GET ideas listing. */
router.get('/', function (req, res, next) {
    var response = {};
    console.log('ideas is called');
    //res.send({"result":"OK"});
    if (req.params.userId) {
        IdeaModel.find({submittedBy: req.params.userId}, function (err, result) {
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = result;
            }
            res.send(response);
        });
    } else {
        IdeaModel.find({}, function (err, result) {
            if (err) {
                response = {"error": true, "message": "Error fetching data"};
            } else {
                response = result;
            }
            res.send(response);
        });
    }
});
/* GET ideas by Id */
router.get('/:id', function (req, res) {

    console.log('ideas is called' + req.params.id);
    //find the idea by ID
    IdeaModel.findById(req.params.id).populate({path: 'submittedBy', model: UserModel}).exec(function (err, result) {
        if (err) {
            console.log('Error ' + err);
            res.status(404).send('Not found');
        } else {
            res.send(result);
        }
    });
});

//POST to create an Idea
router.post('/', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    console.log('POST to create an Idea is called');

    UserModel.findOne({email: req.body.submittedBy.email}, function (err, user) {
        if (!user) {
            var user = UserModel({
                firstName: req.body.submittedBy.firstName,
                lastName: req.body.submittedBy.lastName,
                email: req.body.submittedBy.email,
                phone: req.body.submittedBy.phone});
            user.save(function (err, result) {
                if (err) {
                    console.log("Error" + err);
                    throw err;
                }
                saveNewIdea(result, req, res);
                console.log('User created!' + result);
            });
        } else {
            saveNewIdea(user, req, res);
        }
    });

});
/**
 * 
 * @param {type} userDetails
 * @param {type} req
 * @param {type} res
 * @returns {undefined}
 */
function saveNewIdea(userDetails, req, res) {
    var idea = IdeaModel({
        title: req.body.title,
        summary: req.body.summary,
        submittedBy: userDetails,
        createdDate: Date.now()});

    idea.save(function (err, result) {
        if (err) {
            console.log("Error" + err);
            throw err;
        }
        console.log('Idea created!');
        res.send(result);
    });
}
//PUT to update an Idea by ID
router.put('/:id', function (req, res) {
    console.log('update id' + req.params.id);
    //find the idea by ID  
    IdeaModel.findOne({_id: req.params.id}, function (err, idea) {
        if (err) {
            console.log('Error in Idea update!' + err);
            res.send("There was a problem updating the information to the database: " + err);
            return;
        }
        //update it
        console.log('Found idea for' + req.params.id);
        console.log(idea);
        idea.update({
            title: req.body.title || idea.title,
            summary: req.body.summary || idea.summary,
            totalPoints: req.body.totalPoints || idea.totalPoints,
            status: req.body.status || idea.status
        }, function (err, result) {
            if (err) {
                console.log('Error in Dept update!' + err);
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                console.log('Idea updated!' + JSON.stringify(result));
                res.format({
                    //JSON responds showing the updated values
                    json: function () {
                        res.json(result);
                    }
                });
            }
        });
        console.log('Idea updated!');
    });
});
//DELETE all
router.delete('/', function (req, res) {

    console.log('DELETE...All');
    IdeaModel.remove({}, function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
//DELETE an idea by ID
router.delete('/:id', function (req, res) {
    //find emp by ID
    console.log('delete id:' + req.params.id);
    IdeaModel.findById(req.params.id, function (err, idea) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            idea.remove(function (err, result) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + result._id);
                    removeRelatedCollections(req.params.id);
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
    console.log('Idea deleted!');
});

function removeRelatedCollections(deletedIdea) {
    ResourceModel.remove({idea: deletedIdea}, function (err, removed) {
        console.log('resources deleted for ' + deletedIdea);
    });
    TeamModel.remove({idea: deletedIdea}, function (err, removed) {
        console.log('teams deleted for ' + deletedIdea);
    });
    VoteModel.remove({idea: deletedIdea}, function (err, removed) {
        console.log('votes deleted for ' + deletedIdea);
    });
}
module.exports = router;
