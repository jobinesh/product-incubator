/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'utils', 'data/data', 'ojs/ojrouter', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojpagingcontrol-model'],
        function (oj, ko, utils, data)
        {
            oj.Logger.option("level", oj.Logger.LEVEL_INFO);
            function AllIdeasViewModel() {
                var _this = this;
                _this.i18n = oj.Translations.getTranslatedString;
                _this.SERVER = "http://localhost:3001/users/56dfec6a90b19fcc21a40fb9/ideas";

                _this.allIdeas = ko.observableArray([]);
                _this.datasource = ko.observable();
                _this.serviceURL = _this.SERVER;

                _this.truncatedText = function (content) {
                    return (content.length > 25 ? content.substring(0, 24) + "..." : content);
                }
                _this.parseIdea = function (response) {
                    return {_id: response["_id"],
                        title: response["title"],
                        summary: _this.truncatedText(response["summary"]),
                        submittedBy: response["submittedBy"],
                        totalPoints: response["totalPoints"],
                        status: response["status"]
                    };
                };

                /*
                 _this.Idea = oj.Model.extend({
                 urlRoot: _this.serviceURL,
                 parse: _this.parseIdea,
                 idAttribute: "_id"
                 });
                 _this._idea = new _this.Idea();
                 _this.IdeaCollection = new oj.Collection.extend({
                 url: _this.serviceURL,
                 model: _this._idea
                 });
                 _this.allIdeas(new IdeaCollection());
                 */

                var defaultLayout = utils.readCookie('ideasLayout');
                if (defaultLayout) {
                    _this.ideasLayoutType = ko.observable(defaultLayout);
                } else {
                    _this.ideasLayoutType = ko.observable('ideasCardLayout');
                }

                _this.ready = ko.observable(false);

                data.fetchData(_this.serviceURL).then(function (result) {
                    //_this.allIdeas(result);
                    result.forEach(function (entry) {
                        console.log(entry);
                        _this.allIdeas.push(_this.parseIdea(entry));
                    });
                }).fail(function (error) {
                    console.log('Error in getting People data: ' + error.message);
                });



                _this.nameSearch = ko.observable('');

                _this.filteredAllIdeas = ko.computed(function () {
                    var ideaFilter = new Array();

                    if (_this.allIdeas().length !== 0) {
                        if (_this.nameSearch().length === 0)
                        {
                            ideaFilter = _this.allIdeas();
                        } else {
                            ko.utils.arrayFilter(_this.allIdeas(),
                                    function (r) {
                                        var token = _this.nameSearch().toLowerCase();
                                        if (r.title.toLowerCase().indexOf(token) === 0) {
                                            ideaFilter.push(r);
                                        }
                                    });
                        }
                    }

                    _this.ready(true);
                    return ideaFilter;
                });

                _this.listViewDataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(_this.filteredAllIdeas(), {idAttribute: '_id'});
                });

                _this.cardViewPagingDataSource = ko.computed(function () {
                    return new oj.ArrayPagingDataSource((_this.filteredAllIdeas()));
                });

                _this.cardViewDataSource = ko.computed(function () {
                    return _this.cardViewPagingDataSource().getWindowObservable();
                });

                _this.getPhoto = function (id) {
                    var src = 'css/images/people/nopic.png';
                    return src;
                };

                _this.getEmail = function (submitter) {
                    return "mailto:" + submitter.email;
                };

                _this.getFacetime = function (submitter) {
                    return "#";
                };

                _this.getChat = function (submitter) {
                    return "#";
                };

                _this.getTeam = function (org, event) {
                    alert('This will take you to the employee page and highlight the team infotile');
                };



                _this.cardLayoutHandler = function () {
                    utils.createCookie('ideasLayout', 'ideasCardLayout');
                    _this.ideasLayoutType('ideasCardLayout');
                };

                _this.listLayoutHandler = function () {
                    utils.createCookie('ideasLayout', 'ideasListLayout');
                    _this.ideasLayoutType('ideasListLayout');
                };

                _this.loadIdeaPage = function (idea) {
                    if (idea._id) {
                        // Temporary code until go('person/' + emp.empId); is checked in 1.1.2
                        history.pushState(null, '', 'index.html?root=ideaDetail&idea=' + idea._id);
                        oj.Router.sync();
                    } else {
                        // Default id for person is 100 so no need to specify.
                        oj.Router.rootInstance.go('ideaDetail');
                    }
                };

                _this.onEnter = function (data, event) {
                    if (event.keyCode === 13) {
                        var idea = {};
                        idea._id = data._id;
                        _this.loadIdeaPage(idea);
                    }
                    return true;
                };

                _this.changeHandler = function (page, event) {
                    if (event.option === 'selection') {
                        if (event.value[0]) {
                            var idea = {};
                            idea.empId = event.value[0];
                            _this.loadIdeaPage(idea);
                        }
                    }
                };

            }

            return AllIdeasViewModel;
        });
