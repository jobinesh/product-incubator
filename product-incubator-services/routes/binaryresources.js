//http://stackoverflow.com/questions/27167336/store-files-in-mongodb-using-mongoose
var formidable = require('formidable');
var mongoose = require('mongoose');
var grid = require('gridfs-stream');
var fs = require('fs');
var util = require('util');
var express = require('express');
var router = express.Router();
var ResourceModel = require('../model/resource');

/* GET ideas listing. */
router.get('/', function (request, response) {
    response.send(
            '<form method="post" action="/fileupload" enctype="multipart/form-data">'
            + '<input type="file" id="file" name="file">'
            + '<input type="submit" value="submit">'
            + '</form>'
            );
});
/* GET ideas by Id */
router.get('/:id', function (req, res) {

    console.log('ideas is called' + req.params.id);
    //find the idea by ID

    ResourceModel.findById(req.params.id, function (err, result) {
        if (err) {
            console.log('Error ' + err);
            next(err);
        } else {
            res.contentType(doc.img.contentType);
            res.send(result.img.data);
        }
    });
});

//POST to create an Idea
router.post('/', function (req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var form = new formidable.IncomingForm();
    form.uploadDir = __dirname + "/data";
    form.keepExtensions = true;
    form.parse(req, function (err, fields, files) {
        if (!err) {
            console.log('File uploaded : ' + files.file.path);
            grid.mongo = mongoose.mongo;
            var conn = mongoose.createConnection('..mongo connection string..');
            conn.once('open', function () {
                var gfs = grid(conn.db);
                var writestream = gfs.createWriteStream({
                    filename: files.file.name
                });
                fs.createReadStream(files.file.path).pipe(writestream);
            });
        }
    });
    form.on('end', function () {
        res.send('Completed ..... go and check fs.files & fs.chunks in  mongodb');
    });
});

module.exports = router;
