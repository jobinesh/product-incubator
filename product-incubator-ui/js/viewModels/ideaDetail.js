/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'data/data', 'moment', 'jquery', 'ojs/ojknockout', 'ojs/ojinputnumber', 'ojs/ojradioset', 'ojs/ojvalidation', 'ojs/ojtagcloud', 'ojs/ojchart'],
        function (oj, ko, jsonData, moment, $)
        {
            oj.Logger.option("level", oj.Logger.LEVEL_INFO);
            ko.bindingHandlers.starRating = {
                init: function (element, valueAccessor) {
                    $(element).addClass("starRating");
                    for (var i = 0; i < 5; i++)
                        $("<span>").appendTo(element);

                    // Handle mouse events on the stars
                    $("span", element).each(function (index) {
                        $(this).hover(
                                function () {
                                    $(this).prevAll().add(this).addClass("hoverChosen")
                                },
                                function () {
                                    $(this).prevAll().add(this).removeClass("hoverChosen")
                                }
                        ).click(function () {
                            var observable = valueAccessor();  // Get the associated observable
                            observable(index + 1);               // Write the new rating to it
                        });
                    });
                },
                update: function (element, valueAccessor) {
                    // Give the first x stars the "chosen" class, where x <= rating
                    var observable = valueAccessor();
                    $("span", element).each(function (index) {
                        $(this).toggleClass("chosen", index < observable());
                    });
                }
            };

            function IdeaDetailViewModel() {

                var _this = this;
                _this.i18n = oj.Translations.getTranslatedString;
                _this.serverURL = "http://localhost:3001/ideas";

                _this.colorHandler = new oj.ColorAttributeGroupHandler();
                _this._id = ko.observable();
                _this._voteId = ko.observable();
                _this.title = ko.observable();
                _this.summary = ko.observable();
                _this.totalPoints = ko.observable();
                _this.status = ko.observable();
                _this.firstName = ko.observable();
                _this.lastName = ko.observable();
                _this.email = ko.observable();
                _this.phone = ko.observable();
                _this.twitterId = ko.observable();
                _this.linkedInId = ko.observable();
                _this.jobTitle = ko.observable();
                _this.team = ko.observable();
                _this.comments = ko.observable();
                _this.detailsContentTemplate = ko.observable('personDetails/about');
                console.log('---ideaDetail --1');

                _this.handleActivated = function (info) {
                    var parentRouter = info.valueAccessor().params.ojRouter.parentRouter;

                    // Retrieve the childRouter instance created in main.js
                    _this.ideaRouter = parentRouter.currentState().value;
                    console.log('---ideaDetail --2');
                    _this.ideaRouter.configure(function (stateId) {
                        var state;
                        // 56dfedc615577abc0bb44667
                        console.log('---ideaDetail --22' + stateId);
                        if (!state)
                            state = '56dfedc615577abc0bb44667';
                        if (stateId) {
                            var data = stateId.toString();

                            state = new oj.RouterState(data, {
                                value: data,
                                // For each state, before entering the state,
                                // make sure the data for it is loaded.
                                canEnter: function () {
                                    // The state transition will be on hold
                                    // until loadData is resolved.
                                    return _this.loadData(data);
                                }
                            });
                        }
                        return state;
                    });

                    // Returns the sync promise to handleActivated. The next
                    // phase of the ojModule lifecycle (attached) will not be
                    // executed until sync is resolved.
                    return oj.Router.sync();
                };

                function getIdeaURL(id) {
                    var url = _this.serverURL + "/" + id;
                    console.log('---ideaDetail --url ' + url);
                    return url;
                }

                _this.goIdea = function (ideaId) {
                    _this.ideaRouter.go(ideaId.toString());
                    return true;
                };

                _this.onEnter = function (ideaId, event) {
                    if (event.keyCode === 13) {
                        _this.ideaRouter.go(ideaId.toString());
                        return true;
                    }
                };

                // canEnter requires a promise that resolve as true or false
                _this.loadData = function (id) {
                    return new Promise(function (resolve, reject) {
                        console.log('---ideaDetail --3');
                        jsonData.fetchData(getIdeaURL(id)).then(function (idea) {
                            _this.loadIdeaDetails(idea);
                            resolve(true);
                        }).fail(function (error) {
                            console.log('Error: ' + error.message);
                            resolve(false);
                        });
                    });
                };
                _this.loadIdeaDetails = function (response) {
                    console.log("loadIdeaDetails: " + JSON.stringify(response));
                    _this._id(response['_id']);
                    _this.title(response['title']);
                    _this.summary(response['summary']);
                    _this.totalPoints(response['totalPoints']);
                    _this.status(response['status']);
                    _this.firstName(response['submittedBy']['firstName']);
                    _this.lastName(response['submittedBy']['lastName']);
                    _this.email(response['submittedBy']['email']);
                    _this.phone(response['submittedBy']['phone']);
                    _this.twitterId(response['submittedBy']['twitterId']);
                    _this.linkedInId(response['submittedBy']['linkedInId']);
                    _this.jobTitle(response['submittedBy']['jobTitle']);
                    _this.team(response['submittedBy']['team']);
                }

                _this.personClickHandler = function (data) {
                    _this.selectedTab(data._id);
                    // ko.utils.arrayForEach(_this.personProfile().comps, function (item) {
                    //});
                    //var newPage = "personDetails/" + data.title.toLowerCase();
                    //_this.detailsContentTemplate(newPage);
                    return true;
                };

                _this.getColor = function (skillValue) {
                    return _this.colorHandler.getValue(skillValue);
                };

                _this.getPhoto = function (id) {
                    var src = 'css/images/organizations/110.png';
                    return src;
                };

                _this.getEmail = function (email) {
                    return "mailto:" + email + '@example.net';
                };

                _this.getOrg = function (data, event) {
                    alert('This will take you to the employee page and highlight the team infotile');
                };
                _this.getColor = function (skillValue) {
                    return _this.colorHandler.getValue(skillValue);
                };
                _this.closeDialog = function () {
                    $("#ratingDialog").ojDialog("close");
                };
                _this.showRatingDlg = function () {
                    var voteURL = "http://localhost:3001/votes?idea=" + _this._id() + "&user=" + "56dfec6a90b19fcc21a40fb9";
                    console.log("voteURL: " + voteURL);
                    jsonData.fetchData(voteURL).then(function (vote) {
                        console.log("vote : " + JSON.stringify(vote));
                        if (!$.isEmptyObject(vote)) {
                            _this._voteId(vote._id);
                            _this.comments(vote.comment);
                            _this.totalPoints(vote.rating);
                        } else {
                            _this._voteId("-1");
                            _this.comments("");
                            _this.totalPoints(0);
                        }
                    }).fail(function (error) {
                        console.log('Error in getting Vote data: ' + error.message);
                        _this._voteId("-1");
                        _this.comments("");
                        _this.totalPoints(0);
                    });

                    $("#ratingDialog").ojDialog("open");
                };
                function getDataforTransfer() {
                    //['New', 'Review', 'Accepted', 'Rejected']
                    var ideaStatus = _this.status() ? _this.status() : "Review";
                    var data = {"idea": _this._id(), "comment": _this.comments(), "rating": _this.totalPoints(), "status": ideaStatus, "votedBy": "56dfec6a90b19fcc21a40fb9"};
                    return data;
                }
                _this.submit = function () {
                    var serverUrl = "http://localhost:3001/votes";
                    var ratingData = getDataforTransfer();
                    console.log(serverUrl + " : " + JSON.stringify(ratingData));
                    var restAction = (_this._voteId() === "-1" ? "POST" : "PUT");
                    if (restAction === "PUT") {
                        serverUrl = serverUrl + "/" + _this._voteId();
                    }
                    console.log("rest action : " + restAction);
                    $.ajax({
                        type: restAction,
                        url: serverUrl,
                        data: JSON.stringify(getDataforTransfer()),
                        contentType: "application/json",
                        crossDomain: true,
                        dataType: "json",
                        success: function (data, status, jqXHR) {
                            console.log("Success " + status.code);
                            console.log("Response obj " + data);
                        },
                        error: function (jqXHR, status) {
                            // error handler
                            console.log(jqXHR + status.code);

                        }
                    });
                    $("#ratingDialog").ojDialog("close");
                };

            }

            return  new IdeaDetailViewModel();
        });
