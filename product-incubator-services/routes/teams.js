var express = require('express');
var router = express.Router();
var TeamModel = require('../model/team');
var UserModel = require('../model/user');

/* GET team listing. */
router.get('/', function (req, res, next) {
    var response = {};
    console.log('teams is called');
    //res.send({"result":"OK"});
    
    TeamModel.find({}).populate({path:'memberInfo', model:UserModel}).exec(function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
/* GET teams by Id */
router.get('/:id', function (req, res) {

    console.log('ideas is called' + req.params.id);
    //find the idea by ID

    TeamModel.findById(req.params.id, function (err, idea) {
        if (err) {
            console.error(err);
            res.status(404).send('Not found');
        } else {
            res.send(idea);
        }
    });
});

//POST to create an Idea
router.post('/', function (req, res, next) {
    // Get our REST or form values. These rely on the "name" attributes
    console.log('POST to create a team is called');

    UserModel.findOne({email: req.body.memberInfo.email}, function (err, user) {
        if (!user) {
            var user = UserModel({
                firstName: req.body.memberInfo.firstName,
                lastName: req.body.memberInfo.lastName,
                email: req.body.memberInfo.email,
                phone: req.body.memberInfo.phone,
                socialMedia: req.body.memberInfo.socialMedia,
                jobTitle: req.body.memberInfo.jobTitle,
                team: req.body.memberInfo.team
            });
            user.save(function (err, result) {
                if (err) {
                    console.log(err.stack);
                    next(err);
                    return;
                }
                saveNewTeam(result, req, res, next);
                console.log('team created!' + result);
            });
        } else {
            saveNewTeam(user, req, res, next);
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
function saveNewTeam(userDetails, req, res, next) {

    var team = TeamModel({
        idea: req.body.idea,
        memberInfo: userDetails,
        createdDate: Date.now()});

    team.save(function (err, result) {
        if (err) {
            console.error(err.stack);
            next(err);
        }
        console.log('Team created!');
        res.send(result);
    });
}

//DELETE all
router.delete('/', function (req, res) {

    console.log('DELETE...All');
    TeamModel.remove({}, function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
//DELETE an idea by ID
router.delete('/:id', function (req, res, next) {
    //find emp by ID
    console.log('delete id:' + req.params.id);
    TeamModel.findById(req.params.id, function (err, team) {
        if (err) {
            console.error(err.stack);
            next(err);
        } else {
            //remove it from Mongo
            team.remove(function (err, result) {
                if (err) {
                    console.error(err.stack);
                    next(err);
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
    console.log('Idea deleted!');
});
module.exports = router;
