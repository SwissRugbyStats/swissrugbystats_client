'use strict';
/**
 * Created by chregi on 2/28/15.
 */




 // parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
}



var getSchedule = function() {

	var id = jQuery('#srs-schedule').attr('data-teamid');

	jQuery.ajax({
	    url: "http://api.swissrugbystats.ch/teams/"+id+"/games.json",
	    success: function(data){
            
            /* build schedule table
             * TODO: 
             * - kickoff vs result
             * - provided by rugbygear.ch claim
            */
            var tableStr = "";
            tableStr = "<table class='srs-scheduletable'><thead><tr><th>Datum</th><th>Host</th><th>Guest</th><th>Kickoff / Result</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                // parse the date
                var d = parseDate(data[i].date);
                var dStr = ("0" + d.getDate()).slice(-2) +"."+ ("0"+(d.getMonth()+1)).slice(-2) +"."+ d.getFullYear();
                tableStr += "<tr><td>" + dStr + "</td><td>" + data[i].host.team.name + "</td><td>" + data[i].guest.team.name + "</td><td></td></tr>";
            }
            
            tableStr += "</tbody></table>";
            jQuery("#srs-schedule").html(tableStr);
	    }
	});

}

var getNextGame = function() {

	var id = jQuery('#srs-nextGame').attr('data-teamid');

	jQuery.ajax({
	    url: "http://api.swissrugbystats.ch/nextGameByTeamId/"+id+"/.json",
	    success: function(data){
	      jQuery('#srs-nextGame').html("Host: " + data.host.team.name + "<br>Guest: " + data.guest.team.name);
	    }
	});
}

/* execute as soon as DOM is ready
 * TODO: check for existing tags first to reduce ajax calls to minimum
 */
window.onload = function() {

	getSchedule();
	getNextGame();

};