/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'utils', 'data/data', 'ojs/ojrouter', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojpagingcontrol-model'],
        function (oj, ko, utils, data)
        {
            oj.Logger.option("level", oj.Logger.LEVEL_INFO);

            function PeopleViewModel() {
                var self = this;
                self.i18n = oj.Translations.getTranslatedString;
                self.SERVER = "http://localhost:3001/teams";

                var defaultLayout = utils.readCookie('peopleLayout');
                if (defaultLayout) {
                    self.peopleLayoutType = ko.observable(defaultLayout);
                } else {
                    self.peopleLayoutType = ko.observable('peopleCardLayout');
                }
                self.firstName = ko.observable();
                self.lastName = ko.observable();
                self.email = ko.observable();
                self.phone = ko.observable();
                self.twitterId = ko.observable();
                self.linkedInId = ko.observable();
                self.jobTitle = ko.observable();
                self.allPeople = ko.observableArray([]);
                self.ready = ko.observable(false);

                //add the model to the collection at index 0
                self.validateAllRequiredFlds = function () {
                    oj.Logger.info("validate- begin");
                    var valid = true;

                    $('input,textarea,select').attr('required', true).each(function () {
                        oj.Logger.info("validate- if entered");
                        var constructor = oj.Components.getWidgetConstructor(this);
                        if (constructor) {

                            valid = constructor('validate');
                            oj.Logger.info("validate:" + valid);
                        }
                    });
                    oj.Logger.info("validate- done");
                    return valid;//(ret1 && ret2);
                };
                self.buildMemberModelForTransfer = function () {
                    oj.Logger.info('build member model');
                    return {
                        "idea": "56dfedc615577abc0bb44667",
                        "memberInfo": {
                            "firstName": self.firstName(),
                            "lastName": self.lastName(),
                            "email": self.email(),
                            "phone": self.phone(),
                            "jobTitle": self.jobTitle(),
                            "socialMedia": [{"linkedInId": self.linkedInId()},
                                {"twitterId": self.twitterId()}]
                        }

                    };
                };
                self.showMemberDialog = function () {
                    $("#memberDialog").ojDialog("open");
                };
                self.closeMemberDialog = function () {
                    $("#memberDialog").ojDialog("close");

                };
                self.saveMember = function () {

                    // if (!self.validateAllRequiredFlds()) {
                    //     return false;
                    //  }

                    var member = self.buildMemberModelForTransfer();
                    $.ajax({
                        type: "POST",
                        url: self.SERVER,
                        data: JSON.stringify(member),
                        contentType: "application/json",
                        crossDomain: true,
                        dataType: "json",
                        success: function (data, status, jqXHR) {
                            self.allPeople.push(data);
                            oj.Logger.info("Success " + status.code);
                            oj.Logger.info("Response obj " + data);
                            $("#memberDialog").ojDialog("close");
                        },
                        error: function (jqXHR, status) {
                            // error handler
                            oj.Logger.info(jqXHR + status.code);

                        }
                    });

                    return true;
                };


                self.parseTeam = function (response) {
                    return {_id: response["_id"],
                        idea: response["idea"],
                        memberInfo: response["memberInfo"]
                    };
                };
                data.fetchData(self.SERVER).then(function (result) {
                    //_this.allIdeas(result);
                    result.forEach(function (entry) {
                        var obj = self.parseTeam(entry);
                        oj.Logger.info(obj);
                        oj.Logger.info(entry['memberInfo']['firstName']);                    
                        self.allPeople.push(obj);
                    });
                }).fail(function (error) {
                    oj.Logger.info('Error in getting People data: ' + error.message);
                });


                self.nameSearch = ko.observable('');

                self.filteredAllPeople = ko.computed(function () {
                    var peopleFilter = new Array();

                    if (self.allPeople().length !== 0) {
                        if (self.nameSearch().length === 0)
                        {
                            peopleFilter = self.allPeople();
                        } else {
                            ko.utils.arrayFilter(self.allPeople(),
                                    function (r) {
                                        var token = self.nameSearch().toLowerCase();
                                        if (r.firstName.toLowerCase().indexOf(token) === 0 || r.lastName.toLowerCase().indexOf(token) === 0) {
                                            peopleFilter.push(r);
                                        }
                                    });
                        }
                    }

                    self.ready(true);
                    return peopleFilter;
                });

                self.listViewDataSource = ko.computed(function () {
                    return new oj.ArrayTableDataSource(self.filteredAllPeople(), {idAttribute: '_id'});
                });

                self.cardViewPagingDataSource = ko.computed(function () {
                    return new oj.ArrayPagingDataSource((self.filteredAllPeople()));
                });

                self.cardViewDataSource = ko.computed(function () {
                    return self.cardViewPagingDataSource().getWindowObservable();
                });

                self.getPhoto = function (empId) {
                    var src = 'css/images/people/nopic.png';
                    return src;
                };

                self.getEmail = function (email) {
                    return "mailto:" + email + '@example.net';
                };

                self.getFacetime = function (emp) {
                    return "#";
                };

                self.getChat = function (emp) {
                    return "#";
                };

                self.getOrg = function (org, event) {
                    alert('This will take you to the employee page and highlight the team infotile');
                };

                self.getTenure = function (emp) {
                    var now = new Date().getFullYear();
                    var hired = new Date(emp.hireDate).getFullYear();
                    var diff = now - hired;
                    return diff;
                };

                self.cardLayoutHandler = function () {
                    utils.createCookie('peopleLayout', 'peopleCardLayout');
                    self.peopleLayoutType('peopleCardLayout');
                };

                self.listLayoutHandler = function () {
                    utils.createCookie('peopleLayout', 'peopleListLayout');
                    self.peopleLayoutType('peopleListLayout');
                };

                self.loadPersonPage = function (emp) {
                    if (emp.empId) {
                        // Temporary code until go('person/' + emp.empId); is checked in 1.1.2
                        history.pushState(null, '', 'index.html?root=person&emp=' + emp.empId);
                        oj.Router.sync();
                    } else {
                        // Default id for person is 100 so no need to specify.
                        oj.Router.rootInstance.go('person');
                    }
                };

                self.onEnter = function (data, event) {
                    if (event.keyCode === 13) {
                        var emp = {};
                        emp.empId = data.empId;
                        self.loadPersonPage(emp);
                    }
                    return true;
                };

                self.changeHandler = function (page, event) {
                    if (event.option === 'selection') {
                        if (event.value[0]) {
                            var emp = {};
                            emp.empId = event.value[0];
                            self.loadPersonPage(emp);
                        }
                    }
                };

            }

            return PeopleViewModel;
        });
