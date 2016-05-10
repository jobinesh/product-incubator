var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    //res.render('index', { title: 'Express' });
    var html = "<ul>\
    <li><a href='/auth/github'>GitHub</a></li>\
    <li><a href='/logout'>logout</a></li>\
  </ul>";
    // dump the user for debugging
    if (req.isAuthenticated()) {
        html += "<p>authenticated as user:</p>"
        html += "<pre>" + JSON.stringify(req.user, null, 4) + "</pre>";
    }
    res.send(html);
});

module.exports = router;
