/* Magic Mirror Module: MMM-BCFerries
 * Version: 1.0.0
 *
 * by Tom Hayward
 *
 * derived from MMM-TFL-Arrivals  by Ricardo Gonzalez  https://github.com/ryck/MMM-TFL-Arrivals
 * many thanks to Samuel Pratt for developing the BC Ferries API and providing API services as used in this module  https://github.com/samuel-pratt/bc-ferries-api
 * MIT Licensed.
 */
Module.register("MMM-BCFerries", {
    defaults: {
        app_id: "",        // not currently required for BC Ferries API
        app_key: "",       // not currently required for BC Ferries API
        updateInterval: 5, // update info every 5 minutes
        animationSpeed: 2000,  // time in milliseconds for update animation
        fade: true,        // enable fade to black in displayed list of results
        fadePoint: 0.25,   // (fractional) start position to fade listed results
        initialLoadDelay: 0, // start delay in milliseconds.
        colour: true,      // enable colour text to highlight selected data fields

        customHeader: "",  // custom text to prefix route info in header
        maxWidth: "400px", // maximum display width allowed for this module
        maxResults: 10,    // maximum number of results to display
        termCodeDep: "",   // departure terminal code for BC Ferries API
        termCodeDst: "",   // destination terminal code for BC Ferries API
        vessel_status: "",
        // showVesselIcon: false,  // not yet implemented
        showVesselName: false, // show name of ferry
        showFillSplit: false,  // show percentages of filled space on standard vehicle (car/can/suv) and oversize vehicle (car/van/suv/truck/bus/rv) parking decks

        debug: false       // enable debug info to be sent to console log
    },

    start: function() {
        Log.log("Starting module: " + this.name);
        if (this.data.classes === "MMM-BCFerries") {
            this.data.classes = "bright medium";
        }
        // set up the local values and construct the request url for retrieving sailings data
        // store each terminal name with corresponding 3-letter terminal code in array (for use in displayed route info)
        this.apiBase = "https://bcferriesapi.ca/api/";  // BC Ferries API - for more info, see https://github.com/samuel-pratt/bc-ferries-api
        this.termNames = {BOW: 'Bowen Island', DUK: 'Nanaimo (Duke Point)', FUL: 'Saltspring Island (Fulford Harbour)', HSB: 'Horseshoe Bay', LNG: 'Langdale', NAN: 'Nanaimo (Departure Bay)', SGI: 'Southern Gulf Islands', SWB: 'Swartz Bay', TSA: 'Tsawwassen'};
        this.loaded = false;
        this.vsailings = {};
        this.loaded = false;

        this.scheduleUpdate(this.config.initialLoadDelay);
        this.updateTimer = null;
        this.url = encodeURI(this.apiBase + this.config.termCodeDep + "/" + this.config.termCodeDst + "/");   //https://www.bcferriesapi.ca/api/<DEP>/<DST>/

        if(this.config.debug) {
            console.log("API (data fetch) URL =" + this.url);
        }
        
        this.updateSailingsInfo(this);
    },

    // define updateSailingsInfo()
    updateSailingsInfo: function(self) {
        self.sendSocketNotification("GET_SAILINGS", {"url":self.url});
    },

    // load css for this module
    getStyles: function() {
        return ["MMM-BCFerries.css", "font-awesome.css"];
    },

    // load required scripts
    getScripts: function() {
        return ["moment.js"];
    },

    // load header for module
    getHeader: function() {
        return this.config.header;
    },

    // override dom generator
    getDom: function() {
        var wrapper = document.createElement("div");

        // check that required config parameters are set
        if (this.config.termCodeDep === "") {
            wrapper.innerHTML = "Please set the departure terminal code: " + this.termCodeDep + ".";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.config.termCodeDst === "") {
            wrapper.innerHTML = "Please set the destination terminal code: " + this.termCodeDst + ".";
            wrapper.className = "dimmed light small";
            return wrapper;
        }


        if (!this.loaded) {
            wrapper.innerHTML = "Loading sailings schedule...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }
        
        // show header with route description if sailings data was received -- use custom header if supplied
        if (this.vsailings.data !== null) {
            if (this.config.customHeader !== "") {
                this.config.header = this.config.customHeader + "</br>" + this.termNames[this.config.termCodeDep] + " &rarr; " + this.termNames[this.config.termCodeDst] + "";                
            } else { 
                this.config.header = this.termNames[this.config.termCodeDep] + " &rarr; " + this.termNames[this.config.termCodeDst] + "";
            }
        }
    
        // dump sailings data if debug enabled
        if (this.config.debug) {
            console.log("dump vsailings: " + this.vsailings.data);
        }

        // start building table to list sailings
        var schedtable = document.createElement("table");
        schedtable.className = "small";

        // if we have sailings info
        if(this.vsailings.data !== null) {

            // determine number of returned results
            var counter = this.vsailings.data.length;

            // limit number of displayed results, if necessary
            if (counter > this.config.maxResults) {
                counter = this.config.maxResults;
            }

            // add table header
            var row0 = document.createElement("tr");

            var tHead1 = document.createElement("td");
            tHead1.className = "thead1 xsmall dim";
            tHead1.innerHTML = "Depart";
            row0.appendChild(tHead1);

            if (this.config.showFillSplit) {
                var tHead2 = document.createElement("td");
                tHead2.className = "thead2 xsmall dim";
                tHead2.innerHTML = "Fill: Tot|Std|Ovr";
                tHead2.colSpan = 3;
                row0.appendChild(tHead2);
            } else {
                var tHead2 = document.createElement("td");
                tHead2.className = "thead2 xsmall dim";
                tHead2.innerHTML = "Fill";
                row0.appendChild(tHead2);              
            }
            
            if (this.config.showVesselName) {
                var tHead3 = document.createElement("td");
                tHead3.className = "thead3 xsmall dim";
                tHead3.innerHTML = "Vessel";
                row0.appendChild(tHead3);
            }
            
            var tHead4 = document.createElement("td");
            tHead4.className = "thead4 xsmall dim";
            tHead4.innerHTML = "Stat";
            row0.appendChild(tHead4);            

            schedtable.appendChild(row0);

            // now fill each table row with sailing info
            for (var t = 0; t < counter; t++) {
                var mySailing = this.vsailings.data[t];
 
                var row = document.createElement("tr");
                schedtable.appendChild(row);

                // scheduled departure time
                var schedDepCell = document.createElement("td");
                schedDepCell.className = "xsmall bright timesched";
                schedDepCell.innerHTML = mySailing.time;
                row.appendChild(schedDepCell);
        
                // total percentage fill of vehicle deck space
                var spaceTotCell = document.createElement("td");
                spaceTotCell.className = "xsmall bright fillspace";

                // if enabled, colour text for filled space when nearing deck capacity 
                var deckfill = mySailing.fill;
                if (deckfill > 90 && this.config.colour) {
                    spaceTotCell.className += " alert"; // red
                } else if (deckfill > 60 && this.config.colour) {
                    spaceTotCell.className += " warn";  // amber
                } else {
                    spaceTotCell.className += " good";  // green
                }
                spaceTotCell.innerHTML = mySailing.fill;
                row.appendChild(spaceTotCell);
        
                // percentage filled space for standard vs. oversize vehicle decks - display only if enabled
                if (this.config.showFillSplit) {
                    var spaceStdCell = document.createElement("td");
                    spaceStdCell.className = "xsmall bright fillspace";
                    var deckfill = mySailing.carFill;
                    if (deckfill > 90 && this.config.colour) {
                        spaceStdCell.className += " alert";
                    } else if (deckfill > 60 && this.config.colour) {
                        spaceStdCell.className += " warn";
                    } else {
                        spaceStdCell.className += " good";
                    }
                    spaceStdCell.innerHTML = mySailing.carFill;
                    row.appendChild(spaceStdCell);
        
                    var spaceOvrCell = document.createElement("td");
                    spaceOvrCell.className = "xsmall bright fillspace";
                    var deckfill = mySailing.oversizeFill;
                    if (deckfill > 90 && this.config.colour) {
                        spaceOvrCell.className += " alert";
                    } else if (deckfill > 60 && this.config.colour) {
                        spaceOvrCell.className += " warn";
                    } else {
                        spaceOvrCell.className += " good";                        
                    }
                    spaceOvrCell.innerHTML = mySailing.oversizeFill;
                    row.appendChild(spaceOvrCell);
                }
        
                // display vessel name only if enabled
                if (this.config.showVesselName) {
                    var vesselNameCell = document.createElement("td");
                    vesselNameCell.className = "xsmall bright vesselname";
                    vesselNameCell.innerHTML = mySailing.vesselName;
                    row.appendChild(vesselNameCell);
                }
        
                // show vessel status
                var statusCell = document.createElement("td");
                statusCell.className = "xsmall bright";
                statusCell.innerHTML = " " + mySailing.vesselStatus + " ";
                row.appendChild(statusCell);

                // fade display of last row(s) if enabled
				if (this.config.fade && this.config.fadePoint < 1) {
					if (this.config.fadePoint < 0) {
						this.config.fadePoint = 0;
					}
					var startingPoint = this.vsailings.data.length * this.config.fadePoint;
					var steps = this.vsailings.data.length - startingPoint;
					if (t >= startingPoint) {
						var currentStep = t - startingPoint;
						row.style.opacity = 1 - (1 / steps * currentStep);
					}
				}

            } // end for loop

        } else {
            var row1 = document.createElement("tr");
            schedtable.appendChild(row1);

            var messageCell = document.createElement("td");
            messageCell.innerHTML = " " + this.vsailings.message + " ";
            messageCell.className = "bright";
            row1.appendChild(messageCell);

            var row2 = document.createElement("tr");
            schedtable.appendChild(row2);

            var timeCell = document.createElement("td");
            timeCell.innerHTML = " " + this.vsailings.timestamp + " ";
            timeCell.className = "bright";
            row2.appendChild(timeCell);
        } // end if

        wrapper.appendChild(schedtable);
        // *** end building the results table

        return wrapper;

    },

    /* processSailings(data)
    *  store received sailings data into a new array.
    */
    processSailings: function(rdata) {
        // check that we have data back from API
        if (typeof rdata !== "undefined" && rdata !== null && rdata.length !== 0) {
 
            if (this.config.debug) {
                console.log("processSailings(): data length= " + rdata.sailings.length);
            }
        
            // define object to hold all sailings data
            this.vsailings = {};
            // define array of scheduled sailings
            this.vsailings.data = [];
            // define timestamp of current data
            this.vsailings.timestamp = moment().format("LLL");
            // define message holder
            this.vsailings.message = null;

            // determine number of records received
            var counter = rdata.sailings.length;

            // store data field values from each sailing record
            for (var i = 0; i < counter; i++) {
                var tSail = rdata.sailings[i];

                if (this.config.debug) {
                    console.log("processSailings():" + tSail.time + ", " + tSail.fill + ", " + tSail.carFill + ", " + tSail.oversizeFill + ", " + tSail.vesselName + ", " + tSail.vesselStatus);
                }
 
                this.vsailings.data.push({
                    index: i,
                    time: tSail.time,
                    fill: tSail.fill,
                    carFill: tSail.carFill,
                    oversizeFill: tSail.oversizeFill,
                    vesselName: tSail.vesselName,
                    vesselStatus: tSail.vesselStatus
                });
            }

            // arrange sailings data into original (chronological) order
            this.vsailings.data.sort(function(a,b){
                return a.index - b.index;
                }
            );

        } else {
            // no data returned - set error message
            this.vsailings.message = "No data returned";
            this.vsailings.data = null;
            this.vsailings.timestamp = moment().format("LLL");
            if (this.config.debug) {
                console.error("No data returned");
                console.error(this.vsailings.data);
            }
        }

        this.loaded = true;

        this.updateDom(this.config.animationSpeed);
    },


    /* scheduleUpdate()
     * schedule next update.
     * argument (delay) is value in milliseconds before next update -- if empty, this.config.updateInterval is used
     */
    scheduleUpdate: function(delay) {
        var nextLoad = this.config.updateInterval * 60 * 1000; // convert minutes to milliseconds for interval timer
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        } 

        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function() {
            self.updateSailingsInfo(self);
        }, nextLoad);
    },

    // process data returned
    socketNotificationReceived: function(notification, payload) {
        if (notification === "SAILINGS_DATA" && payload.url === this.url) {
            this.processSailings(payload.data);
            this.scheduleUpdate(this.config.updateInterval * 60 * 1000); // convert minutes to milliseconds for interval timer
        }
    }
    
});
