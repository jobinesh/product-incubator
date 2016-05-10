var express = require('express');
var router = express.Router();
var UserModel = require('../model/user');
/* GET users listing. */
router.get('/', function (req, res, next) {
    var response = {};
    console.log('user is called');
    UserModel.find({}, function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
/* GET users listing. */
router.get('/:id', function (req, res) {

    console.log('Get user is Called');
    //res.send({"result":"OK"});

    //find the emp by ID
    UserModel.findById(req.params.id, function (err, dept) {
        if (err) {
            res.status(404).send('Not found');
        } else {
            res.send(dept);
        }
    });
});

//PUT to update a Emp by ID
router.post('/', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    console.log('req id' + req.body._id);

    var user = UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        team: req.body.team,
        jobTitle: req.body.jobTitle,
        createdDate: Date.now()});

    user.save(function (err, result) {
        if (err) {
            console.log("Error" + err);
            throw err;
        }
        console.log('User is created!' + result);
        res.send(result);
    });
});
//PUT to update a Emp by ID
router.put('/:id', function (req, res) {
    console.log('update id' + req.params.id);
    //find the emp by ID
    UserModel.findById(req.params.id, function (err, result) {
        //update it
        console.log('Found dept for' + req.params.id);
        result.update({
            firstName: req.body.firstName || result.firstName,
            lastName: req.body.lastName || result.lastName,
            email: req.body.email || result.email,
            jobTitle: req.body.jobTitle || result.jobTitle,
            phone: req.body.phone || result.phone,
            team: req.body.team || result.team
        }, function (err, result) {
            if (err) {
                console.log('Error in Dept update!' + err);
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                console.log('User is updated!' + JSON.stringify(result));
                res.format({
                    //JSON responds showing the updated values
                    json: function () {
                        res.json(result);
                    }
                });
            }
        });
        console.log('Dept updated!');
    });
});
//DELETE all
router.delete('/', function (req, res) {

    console.log('delet all users');
    UserModel.remove({}, function (err, result) {
        if (err) {
            response = {"error": true, "message": "Error fetching data"};
        } else {
            response = result;
        }
        res.send(response);
    });
});
//DELETE a emp by ID
router.delete('/:id', function (req, res) {
    //find emp by ID
    console.log('delete id:' + req.params.id);
    UserModel.findById(req.params.id, function (err, result) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            result.remove(function (err, deletedUser) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('Removing user with ID: ' + deletedUser._id);
                    res.format({
                        //JSON returns the item with the message that is has been deleted
                        json: function () {
                            res.json({message: 'deleted',
                                item: deletedUser
                            });
                        }
                    });
                }
            });
        }
    });
    console.log('User deleted!');
});
module.exports = router;
