'use strict';
/**
 * Created by chregi on 2/28/15.
 * v0.1 - 13.4.2015
 * - fixed: Kickoff time daylight saving independent
 * - new: put Day in schedule table
 */

 // parse a date in yyyy-mm-dd format
function parseDate(input) {
  var parts = input.match(/(\d+)/g);
  // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
  return new Date(parts[0], parts[1]-1, parts[2], parts[3], parts[4]); // months are 0-based
}

// get hours to add / subtract to date to fix timezone errors
function getHourCorrection(date) {
    return - (date.getTimezoneOffset() / 60);
}

// Get day of week from a date as String
function getDayOfWeek(date) {
    var dow = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
    return dow[date.getDay()];
}



var getSchedule = function(team_id, season_id) {
    var selector = '.srs-schedule[data-teamid='+id+']';

	jQuery.ajax({
	    url: "http://api.swissrugbystats.ch/teams/"+team_id+"/games/season/"+season_id+".json",
	    success: function(data){
            
            /* build schedule table
             * TODO: 
             * - set links
            */
            var tableStr = "";
            tableStr = "<table class='srs-scheduletable'><thead><tr><th>Datum</th><th>Host</th><th>Guest</th><th>Kickoff / Result</th></tr></thead><tbody>";
            for (var i = 0; i < data.length; i++) {
                // parse the date
                var d = parseDate(data[i].date);
                var dStr = ("0" + d.getDate()).slice(-2) +"."+ ("0"+(d.getMonth()+1)).slice(-2) +"."+ d.getFullYear();

                // game result
                if ((data[i].host.score != null) && (data[i].guest.score != null)) {
                    var result = data[i].host.score + " : " + data[i].guest.score;
                } else {
                    var result = (d.getHours() + getHourCorrection(d)) + ":"+ ("0" + d.getMinutes()).slice(-2) + " Uhr";
                }

                tableStr += "<tr><td>" + getDayOfWeek(d) +", "+ dStr + "</td><td>" + data[i].host.team.name + "</td><td>" + data[i].guest.team.name + "</td><td>" + result + "</td></tr>";
            }
            
            tableStr += "</tbody></table>";
            jQuery(selector).html(tableStr);

            jQuery(selector).append("<br/><p>All game data provided by <a href='http://swissrugbystats.ch' target='_blank'>Swiss Rugby Stats</a>");
	    }
	});
}

var getSchedules = function() {
    
    var scheduleTags = jQuery('.srs-schedule');
    jQuery('.srs-schedule').each(function( index ) {
        var team_id = jQuery( this ).attr('data-teamid');
        var season_id = jQuery( this ).attr('data-seasonid');
        getSchedule(team_id, season_id);
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

	getSchedules();
	getNextGame();

};