/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['ojs/ojcore', 'knockout', 'utils', 'data/data', 'ojs/ojrouter', 'ojs/ojknockout', 'promise', 'ojs/ojlistview', 'ojs/ojmodel', 'ojs/ojpagingcontrol', 'ojs/ojtrain', 'ojs/ojpagingcontrol-model', 'ojs/ojtabs', 'ojs/ojconveyorbelt'],
        function (oj, ko, utils, data) {

            function TrainaModel() {
                var self = this;
                self.i18n = oj.Translations.getTranslatedString;

                self.selected = ko.observable('step1');
                self.stepArray =
                        ko.observableArray(
                                [{label: self.i18n('ideas.ideaStep1'), id: 'step1'},
                                    {label: self.i18n('ideas.ideaStep2'), id: 'step2'},
                                    {label: self.i18n('ideas.ideaStep3'), id: 'step3'}]);
                self.nextStep = function () {
                    console.log('nextStep');
                    var next = $("#train").ojTrain("nextSelectableStep");
                    if (next != null)
                        this.selected(next);
                };

                self.previousStep = function () {
                    console.log('previousStep');
                    var prev = $("#train").ojTrain("previousSelectableStep");
                    if (prev != null)
                        this.selected(prev);
                };
                self.selectedText = function () {
                    return ($("#train").ojTrain("getStep", selected())).label;
                };
                self.chosenStepModule = ko.pureComputed(function () {
                    var moduleName;
                    switch (self.selected()) {
                        case "step1":
                            moduleName = "ideaNew";
                            break;
                        case "step2":
                            moduleName = "ideaTeam";
                            break;
                        case "step3":
                            moduleName = "ideaDoc";
                            break;
                        default:
                            moduleName = "ideaNew";
                    }
                    return moduleName;
                });
            }
            return TrainaModel;
        });
