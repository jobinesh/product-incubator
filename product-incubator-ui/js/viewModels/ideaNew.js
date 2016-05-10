/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
//http://myforums.oracle.com/jive3/thread.jspa?messageID=8741056
define(['ojs/ojcore', 'knockout', 'utils', 'data/data', 'ojs/ojrouter', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojpagingcontrol-model'],
        function (oj, ko, utils, data) {
            oj.Logger.option("level", oj.Logger.LEVEL_INFO);

            function IdeaViewModel() {
                var _this = this;
                _this.SERVER = "http://localhost:3001/ideas";
                _this._id = null;
                _this.i18n = oj.Translations.getTranslatedString;
                _this.title = ko.observable();
                _this.summary = ko.observable();
                // App messages
                _this.appMessages = ko.observable();

                _this.buildModel = function () {
                    oj.Logger.info('build model');
                    var model = {
                        "title": _this.title(),
                        "summary": _this.summary(),
                        "submittedBy": {"email": _this.getCurrentUser()},
                        "status": "New"
                    };
                    if (_this._id) {
                        model._id = _this._id;
                    }
                    return model;
                };

                _this.getCurrentUser = function () {
                    var user = "jobinesh@gmail.com";
                    return user;
                }
                /**
                 * Validates all fileds on UI
                 * @returns {Boolean}
                 */
                _this.validateAllRequiredFlds = function () {
                    oj.Logger.info("validateAllRequiredFlds - begin");
                    var valid = true;
                    $('input,textarea,select').attr('required', true).each(function () {
                        oj.Logger.info("validate- if entered");
                        var constructor = oj.Components.getWidgetConstructor(this);
                        if (constructor) {

                            valid = constructor('validate');
                            oj.Logger.warn("validate:" + valid);
                        }
                    });
                    oj.Logger.info("validateAllRequiredFlds - done");

                    return valid;
                };
                _this.save = function () {
                    _this.saveNewIdea();
                };
                _this.saveNewIdea = function () {
                    var msgs = [];
                    if (!_this.validateAllRequiredFlds()) {
                        return false;
                    }
                    oj.Logger.info("saveNewIdea");

                    var serverUrl = _this.SERVER;
                    var newIdea = _this.buildModel();
                    oj.Logger.info(serverUrl + " : " + JSON.stringify(newIdea));
                    $.ajax({
                        type: "POST",
                        url: serverUrl,
                        data: JSON.stringify(newIdea),
                        contentType: "application/json",
                        crossDomain: true,
                        dataType: "json",
                        success: function (result, status, jqXHR) {
                            _this._id = result._id;
                            oj.Logger.info("Success " + status.code);
                            msgs.push({summary: "Idea successfully saved !", detail: "Idea successfully saved !", severity: oj.Message.SEVERITY_TYPE['CONFIRMATION']});
                            _this.appMessages(msgs);
                        },
                        error: function (jqXHR, status) {
                            // error handler
                            msgs.push({summary: "Error in saving your idea!", detail: "Please contact system administrator !", severity: oj.Message.SEVERITY_TYPE['ERROR']});
                            _this.appMessages(msgs);
                            oj.Logger.error(jqXHR + status.code);

                        }
                    });

                };
                _this.saveModifiedIdea = function () {

                };
                _this.reset = function () {
                    _this.title(null);
                    _this.summary(null);
                };

            }
            return IdeaViewModel;
        });
