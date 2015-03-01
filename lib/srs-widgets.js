'use strict';
/**
 * Created by chregi on 2/28/15.
 */


var getSchedule = function() {

	var id = $('#srs-schedule').attr('data-teamid');

	$.ajax({
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
                console.log(i + " " + data[i].date);
                tableStr += "<tr><td>" + data[i].date + "</td><td>" + data[i].host.team.name + "</td><td>" + data[i].guest.team.name + "</td><td></td></tr>";
            }
            
            tableStr += "</tbody></table>";
            $("#srs-schedule").html(tableStr);
	    }
	});

}

var getNextGame = function() {

	var id = $('#srs-nextGame').attr('data-teamid');

	$.ajax({
	    url: "http://api.swissrugbystats.ch/nextGameByTeamId/"+id+"/.json",
	    success: function(data){
	      $('#srs-nextGame').html("Host: " + data.host.team.name + "<br>Guest: " + data.guest.team.name);
	    }
	});
}

getSchedule();
getNextGame();