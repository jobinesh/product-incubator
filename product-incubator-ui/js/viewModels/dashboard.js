/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
define(['knockout', 'ojs/ojcore', 'data/data', 'ojs/ojknockout', 'ojs/ojmasonrylayout', 'ojs/ojchart', 'ojs/ojgauge'],
        function (ko, oj, data)
        {
            /* 
             * Your application specific code will go here
             */

            function DashboardViewModel() {
                var self = this;
                self.serverURL = "http://localhost:3001/compositions/summary/56dfec6a90b19fcc21a40fb9";

                self.i18n = oj.Translations.getTranslatedString;
                self.ideaDashBoardData = ko.observable();
                self.ideaRanking = ko.observableArray([]);
                self.pieSeriesValue = ko.observableArray([]);
                self.currentDate = ko.observable(new Date().toLocaleString());//Date.prototype.toLocaleDateString());
                self.ready = ko.observable(false);


                convertToPieSeriesValue = function (ideaSummary) {
                    var pieSeries = [];
                    pieSeries.push({name: "approved", items: [ideaSummary["approved"]]});
                    pieSeries.push({name: "new", items: [ideaSummary["new"]]});
                    pieSeries.push({name: "review", items: [ideaSummary["review"]]});
                    pieSeries.push({name: "rejected", items: [ideaSummary["rejected"]]});
                    return pieSeries;
                };
                convertToIdeaRanking = function (topIdeas) {
                    var ideaRanking = [];
                    topIdeas.forEach(function (idea) {
                        ideaRanking.push({"title": idea["title"], "totalPoints": idea["totalPoints"], "rate": idea["totalPoints"] %100 , "faderatio": "0.8"});
                    });
                    return ideaRanking;
                };

                self.router = oj.Router.rootInstance;
                var converterFactory = oj.Validation.converterFactory('number');
                self.percentConverter = converterFactory.createConverter({style: 'decimal', maximumFractionDigits: 0});



                data.fetchData(self.serverURL).then(function (result) {
                    self.ideaDashBoardData(result);
                    self.pieSeriesValue(convertToPieSeriesValue(self.ideaDashBoardData().ideaSummary));
                    self.ideaRanking(convertToIdeaRanking(self.ideaDashBoardData().topIdeas));
                    self.ready(true);
                }).fail(function (error) {
                    console.log('Error: ' + error.message);
                });


                self.getIdeaPhoto = function () {
                    var src = 'css/images/myIdea.png';
                    return src;
                };

                self.onEnterLoadPeople = function (data, event) {
                    if (event.keyCode === 13) {
                        self.router.go('people');
                    }
                    return true;
                };

                self.onEnterLoadProfile = function (data, event) {
                    if (event.keyCode === 13) {
                        history.pushState(null, '', 'index.html?root=person&emp=100');
                        oj.Router.sync();
                    }
                    return true;
                };

            }

            return DashboardViewModel;

        });
