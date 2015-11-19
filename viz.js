// Visualizing my MLB data with D3
(function() {
  $( document ).ready(function() {
    eventCodeButtonListener();
    batPitButtonListener();
    playerSearchListener();
    windowResizeListener();

    var canvasWidth = $(window).width(),
        canvasHeight = $(window).height(),
        // Set the height / width of the diamond objects
        dWidth  = 75,
        dHeight = 75;

    var zoom = d3.behavior.zoom()
        .scaleExtent([0.2, 2])
        .on("zoom", zoomed);

    var svg = d3.select(".board-container").append("svg").call(zoom);

    var container = svg.append("g");

    svg.attr("height", canvasHeight)
       .attr("width", canvasWidth);

    function windowResizeListener(){
      $( window ).resize(function() {
        svg.attr("height", $(window).height());
        svg.attr("width", $(window).width());
      });
    }

    function drawDiamond(location, info, player, event_type, battingOrPitching) {
      var x = location[0],
          y = location[1];

      var top    = x.toString() + "," + y.toString(),
          right  = (x + dWidth/2).toString() + "," + (y + dHeight/2).toString(),
          bottom = x + "," + (y + dHeight).toString(),
          left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
          points = top + " " + right + " " + bottom + " " + left;

      var diamondStyleObject = diamondStyler(info, battingOrPitching);

      if (diamondStyleObject.career == 1) {
        diamondStyleObject.polygonClass += ' milestone';
        diamondStyleObject.textClass += ' milestone';
      }
      if (diamondStyleObject.career % 100 === 0) {
        diamondStyleObject.polygonClass += ' milestone';
        diamondStyleObject.textClass += ' milestone';
      }

      switch (diamondStyleObject.game) {
        case 2:
          diamondStyleObject.polygonClass += ' two';
          break;
        case 3:
          diamondStyleObject.polygonClass += ' three';
          break;
        case 4:
          diamondStyleObject.polygonClass += ' four';
          break;
        case 5:
          diamondStyleObject.polygonClass += ' five';
          break;
        case 6:
          diamondStyleObject.polygonClass += ' six';
          break;
      }

      var diamond = container.append("polygon")
                        .attr("points", points)
                        .attr('class', diamondStyleObject.polygonClass);
                      container.append("text")
                          .attr("x", x-(dWidth/7.5))
                          .attr("y", y+(dHeight/2.2))
                          .text(diamondStyleObject.big_text)
                          .attr('class','big-name ' + diamondStyleObject.textClass);
                      container.append("text")
                          .attr("x", x-(dWidth/11))
                          .attr("y", y+(dHeight*0.6))
                          .attr('class', diamondStyleObject.textClass)
                          .text('C: ' + diamondStyleObject.career);
                      container.append("text")
                          .attr("x", x-(dWidth/11))
                          .attr("y", y+(dHeight*0.7))
                          .attr('class', diamondStyleObject.textClass)
                          .text('S: ' + diamondStyleObject.season);
                      container.append("text")
                          .attr("x", x-(dWidth/11))
                          .attr("y", y+(dHeight*0.8))
                          .attr('class', diamondStyleObject.textClass)
                          .text('G: ' + diamondStyleObject.game);
      return diamond;
    }

    function drawBoard(diamondsToBuild, player, event_type, battingOrPitching){
      if (diamondsToBuild.length === 0) {
        $('.meta').addClass('warning');
      } else {
        var diamondCount = 0,
          diamondsToBuildCount = diamondsToBuild.length;

        // The board is the widest when the current row is equal to the square root of the number to build rounded up.
        var widestRow = Math.ceil(Math.sqrt(diamondsToBuildCount)),
            // When the widest row has been built, we will turn shrink mode on
            shrink = false;

        // Draw diamonds while there are diamonds to build
        var rowWidth = 1, // Start at row 1. The board is a square turned 45
                          // degrees, so row width and number of diamonds in
                          // a row are the same.
            diamondsInRow = 0, // Current count of diamonds in row
            rowStart      = [$(window).width()/2, 50], // Where to start the row.
            coords        = [$(window).width()/2, 50]; // Where to start the first diamond.

        while (diamondCount <= diamondsToBuildCount) {
          while (diamondsInRow < rowWidth) {
            // Draw diamond at current coords and pass JSON content as arg
            drawDiamond(coords, diamondsToBuild[diamondCount], player, event_type, battingOrPitching);
            // Increment diamondCount
            diamondCount++;
            // Break out if we've drawn every diamond we need
            if (diamondCount == diamondsToBuildCount) { return; }
            // Increment diamondsInRow
            diamondsInRow++;
            // Set coords for next diamond one diamond width to the right
            coords[0] += dWidth;
          }
          // Reset diamond count
          diamondsInRow = 0;
          if (rowWidth  == widestRow) {
            shrink = true;
          }
          if (shrink === false) {
            // Increment rowWidth
            rowWidth++;
            // Move the start of the next row down and to the left
            rowStart[0] -= dWidth/2;
            rowStart[1] += dHeight/2;
          } else {
            // Decrement rowWidth
            rowWidth--;
            // Move the start of the next row down and to the right
            rowStart[0] += dWidth/2;
            rowStart[1] += dHeight/2;
          }
          // Set coords to the VALUE of rowStart
          coords = rowStart.slice();
        }
      }
    }

    function requestDiamonds(player_id, player_text, event_type, battingOrPitching) {
      player_id   = player_id   || 'hamib001';
      player_text = player_text || 'Billy Hamilton';
      event_type  = event_type  || 'triples';
      battingOrPitching = battingOrPitching || 'batting';

      var apiLocation = 'https://mlb-event-api.herokuapp.com/v1/players/';
      var url = apiLocation + player_id + '/' + battingOrPitching + '/' + event_type;

      $.get(url)
        .success(function(response){
          drawBoard(response.data,response.player,response.event_type,response.batting_or_pitching);
          $('.sk-folding-cube').hide(function(){
            // Fade in the diamonds
            $('g').fadeIn(300);
            // Fill in the number of diamonds to the control card
            $('.controls .meta').html('<i class="cubes icon"></i> ' + response.data.length + ' diamonds');
            $('.player-name').text(player_text);
            $('.player-name').attr('data-value', player_id);
            $('.filters').children().removeClass('disabled');
            $('.bat-pit-switch').children().removeClass('disabled');
            $('.ui.search .input input').val('');
            $('.ui.search .input').removeClass('disabled');
          });
        })
        .error(function(response){
          console.log(response);
        });
    }

    // Semantic UI player serach
    function playerSearchListener() {
      $('.ui.search')
        .search({
          onSelect: function(result){
            // Set player info from search result
            var player_id = result.player_id;
            var player_text = result.full_name;
            var event_type = $('.filters .button.active').attr('data-value');
            var batOrPit = $('.bat-pit-switch').children('.active').attr('data-value');
            // Clear the diamond board first and then make the diamond request
            clearDiamondBoard(function(){
              requestDiamonds(player_id, player_text, event_type, batOrPit);
            });
            // Disable batting or pitching button while request is being made
            $('.bat-pit-switch').children().addClass('disabled');
            // Disable search while request is being made
            $('.ui.search .input').addClass('disabled');
            // Disable filter buttons while request is being made
            $('.filters').children().addClass('disabled');
          },
          apiSettings: {
            url: 'https://mlb-event-api.herokuapp.com/v1/players/search/{query}'
          },
          fields: {
            results    : 'players',
            title      : 'full_name',
            description: 'debut_year'
          },
          minCharacters: 4
        })
      ;
    }

    function eventCodeButtonListener(){
      // Listen for clicks on '1B', '2B', etc. buttons
      $('body').on('click','.filters .button', function() {
        // Remove the active class from all buttons
        $('.filters').children().removeClass('active');
        // Disable all buttons while request is being made
        $('.filters').children().addClass('disabled');
        // Disable search dropdown while request is being made
        $('.ui.selection.dropdown').addClass('disabled');
        // Disable batting or pitching button while request is being made
        $('.bat-pit-switch').children().addClass('disabled');
        // Add the active class to the button that was clicked on
        $(this).addClass('active');
        // Capture the search term from the button that was clicked on
        var event_type = $(this).attr('data-value');
        // Capture the player_id and text from .player-name on the controls
        var player_id = $('.controls .player-name').attr('data-value');
        var player_text = $('.controls .player-name').text();
        var batOrPit = $('.bat-pit-switch').children('.active').attr('data-value');
        // Clear the diamond board first and then make the diamond request
        clearDiamondBoard(function(){
          requestDiamonds(player_id, player_text, event_type, batOrPit);
        });
      });
    }

    function batPitButtonListener(){
      $('body').on('click','.bat-pit-switch .button', function() {
        // Remove the active class from other button
        $('.bat-pit-switch').children().removeClass('active');
        // Remove the active class from filters
        $('.filters').children().removeClass('active');
        // Add the active class to the button that was clicked on
        $(this).addClass('active');
        // Switch control buttons from one to the other
        if ($(this).attr('data-value') == 'pitching') {
          $('.batting-buttons').hide('slow');
          $('.pitching-buttons').show('slow');
        } else {
          $('.pitching-buttons').hide('slow');
          $('.batting-buttons').show('slow');
        }
      });
    }

    function clearDiamondBoard(callback) {
      // Good place to reset zoom and center of screen
      $('g').hide(300, function(){
        $('.sk-folding-cube').show();
        $('g').children().remove();
        $('.meta').removeClass('warning');
        $('.controls .meta').html('<div class="ui active mini inline loader"></div>');
        $('.controls .player-name').text('Loading...');
        reCenterCanvas();
        callback();
      });
    }

    function zoomed() {
      container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    }

    function reCenterCanvas() {
      container.attr("transform", "translate(0,0)scale(1)");
      zoom.translate([0,0]);
      zoom.scale(1);
    }

    function diamondStyler(info, battingOrPitching) {
      // default polygonClass: 'diamondShape',
      //         textClass: 'diamondText',
      var career, season, game, diamondStyleObject, type, hitType, bigText;

      var typeHash = {
        2: ['O', 'out'],
        3: ['K', 'strikeout'],
        4: ['SB', 'stolen-base'],
        5: ['DI', 'placeholder'],
        6: ['CS', 'placeholder'],
        8: ['PO', 'placeholder'],
        9: ['WP', 'placeholder'],
        10: ['PB', 'placeholder'],
        11: ['BK', 'placeholder'],
        12: ['OA', 'placeholder'],
        13: ['FE', 'placeholder'],
        14: ['BB', 'placeholder'],
        15: ['IBB', 'placeholder'],
        16: ['HBP', 'placeholder'],
        17: ['I', 'placeholder'],
        18: ['E', 'error'],
        19: ['FC', 'placeholder'],
        20: ['1B', 'single'],
        21: ['2B', 'double'],
        22: ['3B', 'triple'],
        23: ['HR', 'home_run'],
        sf: ['SF', 'sacrifice-fly'],
        sh: ['SH', 'sacrifice-hit']
      };

      if (info.batter_career_sacrifice) {
        if (info.sf_fl == 'T') {
          diamondStyleObject = {
            big_text    : 'SF',
            polygonClass: 'sacrifice-fly',
            textClass   : 'diamondText',
            career: info.batter_career_sacrifice,
            season: info.batter_season_sacrifice,
            game  : info.batter_game_sacrifice
          };
        } else if (info.sh_fl == 'T') {
          diamondStyleObject = {
            big_text    : 'SH',
            polygonClass: 'sacrifice-hit',
            textClass   : 'diamondText',
            career: info.batter_career_sacrifice,
            season: info.batter_season_sacrifice,
            game  : info.batter_game_sacrifice
          };
        }
      } else if (info.batter_career_hit ||
                 info.batter_career_single ||
                 info.batter_career_double ||
                 info.batter_career_triple ||
                 info.batter_career_home_run) {

        type = typeHash[info.event_cd];

        if (info.batter_career_hit) {
          hitType = 'hit';
        } else {
          hitType = type[1];
        }

        career = "batter_career_" + hitType;
        season = "batter_season_" + hitType;
        game   = "batter_game_"   + hitType;

        diamondStyleObject = {
          big_text: type[0],
          polygonClass: type[1],
          textClass: 'diamondText',
          career: info[career],
          season: info[season],
          game  : info[game]
        };
      } else if (info.pitcher_career_hit ||
                 info.pitcher_career_single ||
                 info.pitcher_career_double ||
                 info.pitcher_career_triple ||
                 info.pitcher_career_home_run) {

        type = typeHash[info.event_cd];

        if (info.pitcher_career_hit) {
          hitType = 'hit';
        } else {
          hitType = type[1];
        }

        career = "pitcher_career_" + hitType;
        season = "pitcher_season_" + hitType;
        game   = "pitcher_game_"   + hitType;

        diamondStyleObject = {
          big_text: type[0],
          polygonClass: type[1],
          textClass: 'diamondText',
          career: info[career],
          season: info[season],
          game  : info[game]
        };
      } else if (info.runner1_career_stolen_base ||
                 info.runner2_career_stolen_base ||
                 info.runner3_career_stolen_base) {
        var startingBase;
        if (info.runner1_career_stolen_base) {
          startingBase = 1;
        } else if (info.runner2_career_stolen_base) {
          startingBase = 2;
        } else if (info.runner3_career_stolen_base) {
          startingBase = 3;
        }

        career = "runner" + startingBase + "_career_stolen_base";
        season = "runner" + startingBase + "_season_stolen_base";
        game   = "runner" + startingBase + "_game_stolen_base";

        diamondStyleObject = {
          big_text: 'SB',
          polygonClass: 'stolen-base',
          textClass: 'stolen-base',
          career: info[career],
          season: info[season],
          game  : info[game]
        };

      } else if (info.batter_career_walk) {
        bigText = info.event_cd == 15 ? 'IBB' : 'BB';
        diamondStyleObject = {
          big_text: bigText,
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: info.batter_career_walk,
          season: info.batter_season_walk,
          game  : info.batter_game_walk
        };
      } else if (info.pitcher_career_walk) {
        bigText = info.event_cd == 15 ? 'IBB' : 'BB';
        diamondStyleObject = {
          big_text: bigText,
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: info.pitcher_career_walk,
          season: info.pitcher_season_walk,
          game  : info.pitcher_game_walk
        };
      } else if (info.pitcher_career_strikeout) {
        diamondStyleObject = {
          big_text: 'K',
          polygonClass: 'strikeout',
          textClass: 'strikeout',
          career: info.pitcher_career_strikeout,
          season: info.pitcher_season_strikeout,
          game  : info.pitcher_game_strikeout
        };
      } else if (info.batter_career_run ||
                 info.runner1_career_run ||
                 info.runner2_career_run ||
                 info.runner3_career_run) {

        type = typeHash[info.event_cd] || 'N/A';

        if (type == 'O') {
          if (info.sf_fl == 'T'){
            type = typeHash.sf;
          } else if (info.sh_fl == 'T'){
            type = typeHash.sh;
          }
        }
        // This is not very dry yet.
        // One idea:
        // var test = "info." + position + "_" + timeline + "_run";
        career = info.batter_career_run ||
                   info.runner1_career_run ||
                   info.runner2_career_run ||
                   info.runner3_career_run;
        season = info.batter_season_run ||
                   info.runner1_season_run ||
                   info.runner2_season_run ||
                   info.runner3_season_run;
        game = info.batter_game_run ||
                   info.runner1_game_run ||
                   info.runner2_game_run ||
                   info.runner3_game_run;

        diamondStyleObject = {
          big_text: type[0],
          polygonClass: type[1],
          textClass: type[1],
          career: career,
          season: season,
          game  : game
        };
      }

      return diamondStyleObject;
    }

    requestDiamonds();
  });
})();
