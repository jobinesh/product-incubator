var express = require('express');
var router = express.Router();
var ResourceModel = require('../model/resource');

/* GET ideas listing. */
router.get('/', function (req, res, next) {
    var response = {};
    console.log('resources is called');
    //res.send({"result":"OK"});
    ResourceModel.find({}, function (err, result) {
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

    console.log('resources is called' + req.params.id);
    //find the idea by ID

    ResourceModel.findById(req.params.id, function (err, result) {
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
    var resource = ResourceModel({
        idea: req.body.idea,
        resourceTitle: req.body.resourceTitle,
        links: req.body.links,
        createdDate: Date.now});
    resource.save(function (err, result) {
        if (err) {
            console.log("Error" + err);
            next(err);
            return;
        }
        console.log('Resource created!' + result);
        res.send(result);
    });
});
//PUT to update an Idea by ID
router.put('/:id', function (req, res) {
    console.log('update id' + req.params.id);
    //find the idea by ID  
    ResourceModel.findOne({_id: req.params.id}, function (err, resource) {
        if (err) {
            console.log('Error in Idea update!' + err);
            res.send("There was a problem updating the information to the database: " + err);
            return;
        }
        //update it
        console.log('Found idea for' + req.params.id);
        console.log(idea);
        resource.update({
            idea: req.body.idea || resource.idea,
            resourceTitle: req.body.resourceTitle || resource.resourceTitle,
            links: req.body.links || resource.links
        }, function (err, result) {
            if (err) {
                console.log('Error in resource update!' + err);
                res.send("There was a problem updating the information to the database: " + err);
            } else {
                console.log('resource updated!' + JSON.stringify(result));
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
    ResourceModel.remove({}, function (err, result) {
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
    ResourceModel.findById(req.params.id, function (err, resource) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            resource.remove(function (err, result) {
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
    console.log('Resource deleted!');
});
module.exports = router;
