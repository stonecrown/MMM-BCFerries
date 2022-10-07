/* BC Ferries Sailings Schedule
 * Magic Mirror 
 * node helper to fetch sailings data 
 * Module: MMM-BCFerries  by Tom Hayward
 * based on MMM-TFL-Arrivals by Ricardo Gonzalez
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var request = require("request");

module.exports = NodeHelper.create({
   start: function () {
      console.log("MMM-BCFerries helper started...");
   },
   /* getSailingsData()
    * requests new data from BCFerries API.
    * sends data back via socket on successful response.
    */
   getSailingsData: function(url) {
      var self = this;
      var retry = true;

      request({url:url, method: "GET"}, function(error, response, body) {
         if (!error && response.statusCode == 200 && body != null) {
            self.sendSocketNotification("SAILINGS_DATA", {"data": JSON.parse(body), "url": url});
         } else {
            self.sendSocketNotification("SAILINGS_DATA", {"data": null, "url": url});
         }
      });
   },
   // subclass socketNotificationReceived received.
   socketNotificationReceived: function(notification, payload) {
      if (notification === "GET_SAILINGS") {
         this.getSailingsData(payload.url);
      }
   }
});
