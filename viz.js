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
          bottom = x + "," + (y+dHeight).toString(),
          left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
          points = top + " " + right + " " + bottom + " " + left;

      // If the data is batting stats
      if (battingOrPitching == 'batting') {
        switch (info.event_cd) {
          case 2:
          // Generic out
            if (info.sf_fl == 'T') {
              diamondStyleObject = diamondStyler('sf', info, battingOrPitching);
            } else if (info.sh_fl == 'T') {
              diamondStyleObject = diamondStyler('sh', info, battingOrPitching);
            } else {
              diamondStyleObject = diamondStyler('out', info, battingOrPitching);
            }
            break;
          case 3:
          // Strikeout
            if (info.runner1_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run1', info, battingOrPitching);
            } else if (info.runner2_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run2', info, battingOrPitching);
            } else if (info.runner3_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run3', info, battingOrPitching);
            }
            break;
         case 4:
            // Stolen base
            if (info.runner1_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run1', info, battingOrPitching);
            } else if (info.runner2_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run2', info, battingOrPitching);
            } else if (info.runner3_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run3', info, battingOrPitching);
            }
            break;
          case 5:
          // Defensive indifference
            diamondStyleObject = diamondStyler('di', info, battingOrPitching);
            break;
          case 6:
          // Caught Stealing
            diamondStyleObject = diamondStyler('cs', info, battingOrPitching);
            break;
          case 8:
          // Pickoff
            diamondStyleObject = diamondStyler('po', info, battingOrPitching);
            break;
          case 9:
          // Wild Pitch
            diamondStyleObject = diamondStyler('wp', info, battingOrPitching);
            break;
          case 10:
          // Passed Ball
            diamondStyleObject = diamondStyler('pb', info, battingOrPitching);
            break;
          case 11:
          // Balk
            diamondStyleObject = diamondStyler('bk', info, battingOrPitching);
            break;
          case 12:
          // Other advance/out advancing
            diamondStyleObject = diamondStyler('oa', info, battingOrPitching);
            break;
          case 13:
          // Foul Error
            diamondStyleObject = diamondStyler('fe', info, battingOrPitching);
            break;
          case 14:
          // Walk
            if (info.batter_career_walk) {
              diamondStyleObject = diamondStyler('bb', info, battingOrPitching);
            } else if (info.runner1_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run1', info, battingOrPitching);
            } else if (info.runner2_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run2', info, battingOrPitching);
            } else if (info.runner3_career_stolen_base) {
              diamondStyleObject = diamondStyler('sb-run3', info, battingOrPitching);
            } else if (info.runner1_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-bb-run1', info, battingOrPitching);
            } else if (info.runner2_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-bb-run2', info, battingOrPitching);
            } else if (info.runner3_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-bb-run3', info, battingOrPitching);
            }
            break;
          case 15:
          // Intentional Walk
            diamondStyleObject = diamondStyler('ibb', info, battingOrPitching);
            break;
          case 16:
          // Hit by pitch
            diamondStyleObject = diamondStyler('hbp', info, battingOrPitching);
            break;
          case 17:
          // Interference
            diamondStyleObject = diamondStyler('i', info, battingOrPitching);
            break;
          case 18:
          // Error
            if (info.sf_fl == 'T') {
              diamondStyleObject = diamondStyler('sf', info, battingOrPitching);
            } else if (info.sh_fl == 'T') {
              diamondStyleObject = diamondStyler('sh', info, battingOrPitching);
            } else {
              diamondStyleObject = diamondStyler('e', info, battingOrPitching);
            }
            break;
          case 19:
          // Fielder's Choice
            if (info.runner1_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-fc-run1', info, battingOrPitching);
            } else if (info.runner2_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-fc-run2', info, battingOrPitching);
            } else if (info.runner3_career_run) {
              diamondStyleObject = diamondStyler('run-scoring-fc-run3', info, battingOrPitching);
            } else {
              diamondStyleObject = diamondStyler('fc', info, battingOrPitching);
            }
            break;
          case 20:
          // Single
            diamondStyleObject = diamondStyler('1b', info, battingOrPitching);
            break;
          case 21:
          // Double
            diamondStyleObject = diamondStyler('2b', info, battingOrPitching);
            break;
          case 22:
          // Triple
            diamondStyleObject = diamondStyler('3b', info, battingOrPitching);
            break;
          case 23:
          // Home Run
            diamondStyleObject = diamondStyler('hr', info, battingOrPitching);
            break;
        }
      // If the data is pitching stats
      } else if (battingOrPitching == 'pitching') {
        switch (info.event_cd) {
          case 2:
            // Out
            diamondStyleObject = diamondStyler('out', info, battingOrPitching);
            // Sacrifice fly and hit edited out
            break;
          case 3:
            // Strikeout
            diamondStyleObject = diamondStyler('k', info, battingOrPitching);
            break;
          case 4:
            // Stolen base
            diamondStyleObject = diamondStyler('sb', info, battingOrPitching);
            break;
          case 5:
          // Defensive indifference
            diamondStyleObject = diamondStyler('di', info, battingOrPitching);
            break;
          case 6:
          // Caught Stealing
            diamondStyleObject = diamondStyler('cs', info, battingOrPitching);
            break;
          case 8:
          // Pickoff
            diamondStyleObject = diamondStyler('po', info, battingOrPitching);
            break;
          case 9:
          // Wild Pitch
            diamondStyleObject = diamondStyler('wp', info, battingOrPitching);
            break;
          case 10:
          // Passed Ball
            diamondStyleObject = diamondStyler('pb', info, battingOrPitching);
            break;
          case 11:
          // Balk
            diamondStyleObject = diamondStyler('bk', info, battingOrPitching);
            break;
          case 12:
          // Other advance/out advancing
            diamondStyleObject = diamondStyler('oa', info, battingOrPitching);
            break;
          case 13:
          // Foul Error
            diamondStyleObject = diamondStyler('fe', info, battingOrPitching);
            break;
          case 14:
          // Walk
            diamondStyleObject = diamondStyler('bb', info, battingOrPitching);
            break;
          case 15:
          // Intentional Walk
            diamondStyleObject = diamondStyler('ibb', info, battingOrPitching);
            break;
          case 16:
          // Hit by pitch
            big_text = 'HBP';
            polygonClass = 'placeholder';
            textClass = 'placeholder';
            career = info.pitcher_career_hit_by_pitch;
            season = info.pitcher_season_hit_by_pitch;
            game   = info.pitcher_game_hit_by_pitch;
            break;
          case 17:
          // Interference
            big_text = 'I';
            polygonClass = 'placeholder';
            textClass = 'placeholder';
            break;
          case 18:
          // Error
            big_text = 'E';
            polygonClass = 'placeholder';
            textClass = 'placeholder';
            break;
          case 19:
          // Fielder's Choice
            big_text = 'FC';
            polygonClass = 'placeholder';
            textClass = 'placeholder';
            break;
          case 20:
          // Single
            big_text = '1B';
            polygonClass = 'single';
            career = info.pitcher_career_single;
            season = info.pitcher_season_single;
            game   = info.pitcher_game_single;
            break;
          case 21:
          // Double
            big_text = '2B';
            polygonClass = 'double';
            career = info.pitcher_career_double;
            season = info.pitcher_season_double;
            game   = info.pitcher_game_double;
            break;
          case 22:
          // Triple
            big_text = '3B';
            polygonClass = 'triple';
            career = info.pitcher_career_triple;
            season = info.pitcher_season_triple;
            game   = info.pitcher_game_triple;
            break;
          case 23:
          // Home Run
            big_text = 'HR';
            polygonClass = 'homer';
            career = info.pitcher_career_home_run;
            season = info.pitcher_season_home_run;
            game   = info.pitcher_game_home_run;
            break;
          }
          // if (info.pit_id != player) {
          //   polygonClass = 'other-pitcher';
          //   textClass = 'other-pitcher';
          // }

      }
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
      // console.log(diamondStyleObject);
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
                          .text('C: ' + diamondStyleObject.career );
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
            rowStart      = [600,0], // Where to start the row.
            coords        = [600,0]; // Where to start the first diamond.

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
      player_id   = player_id || 'hamib001';
      player_text = player_text || 'Billy Hamilton';
      event_type  = event_type || 'triples';
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
            player_id = result.player_id;
            player_text = result.full_name;
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
            results : 'players',
            title   : 'full_name',
            description : 'debut_year',
          },
          minCharacters : 4,
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

    function diamondStyler(type, info, battingOrPitching) {
      // default polygonClass: 'diamondShape',
      //         textClass: 'diamondText',
      var careerInfo, seasonInfo, gameInfo;

      if (type == 'sf') {
        diamondStyleObject = {
          big_text: 'SF',
          polygonClass: 'sacrifice-fly',
          textClass: 'diamondText',
          career: info.batter_career_sacrifice,
          season: info.batter_season_sacrifice,
          game: info.batter_game_sacrifice
        };
      } else if (type == 'sh') {
        diamondStyleObject = {
          big_text: 'SH',
          polygonClass: 'sacrifice-hit',
          textClass: 'diamondText',
          career: info.batter_career_sacrifice,
          season: info.batter_season_sacrifice,
          game: info.batter_game_sacrifice
        };
      } else if (type == 'out' || type == 'k') {
        if (battingOrPitching == 'batting') {
          careerInfo = info.batter_career_sacrifice;
          seasonInfo = info.batter_season_sacrifice;
          gameInfo   = info.batter_game_sacrifice;
        } else {
          if (info.pitcher_career_strikeout) {
            careerInfo = info.pitcher_career_strikeout;
            seasonInfo = info.pitcher_season_strikeout;
            gameInfo   = info.pitcher_game_strikeout;
          } else {
            careerInfo = info.pitcher_career_out;
            seasonInfo = info.pitcher_season_out;
            gameInfo   = info.pitcher_game_out;
          }
        }
        diamondStyleObject = {
          big_text: type.charAt(0).toUpperCase(),
          polygonClass: type == 'k' ? 'strikeout' : 'out',
          textClass: 'diamondText',
          career: careerInfo,
          season: seasonInfo,
          game: gameInfo
        };
      } else if (type == 'sb-run1' || type == 'sb-run2' || type == 'sb-run3') {
        baseStolen = type.slice(-1);
        career = "runner" + baseStolen + "_career_stolen_base";
        season = "runner" + baseStolen + "_season_stolen_base";
        game = "runner" + baseStolen + "_game_stolen_base";
        diamondStyleObject = {
          big_text: 'SB',
          polygonClass: 'stolen-base',
          textClass: 'stolen-base',
          career: info[career],
          season: info[season],
          game: info[game]
        };
      } else if (type == 'bb' || type ==  'ibb') {
        if (battingOrPitching == 'batting') {
          carrerInfo = info.batter_career_walk;
          seasonInfo = info.batter_season_walk;
          gameInfo   = info.batter_game_walk;
        } else {
          carrerInfo = info.pitcher_career_walk;
          seasonInfo = info.pitcher_season_walk;
          gameInfo   = info.pitcher_game_walk;
        }
        diamondStyleObject = {
          big_text: type.toUpperCase(),
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: carrerInfo,
          season: seasonInfo,
          game  : gameInfo
        };
      } else if (type == 'run-scoring-bb-run1' || type == 'run-scoring-bb-run2' || type == 'run-scoring-bb-run3') {
        scoredFrom = type.slice(-1);
        career = "runner" + scoredFrom + "_career_run";
        season = "runner" + scoredFrom + "_season_run";
        game = "runner" + scoredFrom + "_game_run";
        diamondStyleObject = {
          big_text: 'BB',
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: info[career],
          season: info[season],
          game: info[game]
        };
      } else if (type == 'hbp') {
        diamondStyleObject = {
          big_text: type.toUpperCase(),
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: info.batter_career_hit_by_pitch,
          season: info.batter_season_hit_by_pitch,
          game  : info.batter_game_hit_by_pitch
        };
      } else if (type == 'e') {
        diamondStyleObject = {
          big_text: type.toUpperCase(),
          polygonClass: 'error',
          textClass: 'placeholder',
          career: 'N/A',
          season: 'N/A',
          game  : 'N/A'
        };
      } else if (type == 'run-scoring-fc-run1' || type == 'run-scoring-fc-run2' || type == 'run-scoring-fc-run3') {
        scoredFrom = type.slice(-1);
        career = "runner" + scoredFrom + "_career_run";
        season = "runner" + scoredFrom + "_season_run";
        game = "runner" + scoredFrom + "_game_run";

        diamondStyleObject = {
          big_text: 'FC',
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: info[career],
          season: info[season],
          game  : info[game]
        };
      } else if (type == '1b' || type == '2b' || type == '3b' || type == 'hr') {
        var typeHash = {
          '1b': 'single',
          '2b': 'double',
          '3b': 'triple',
          'hr': 'home_run',
        };
        var hitType;
        if (info.batter_career_hit) {
          hitType = 'hit';
        } else {
          hitType = typeHash[type];
        }
        career = "batter_career_" + hitType;
        season = "batter_season_" + hitType;
        game   = "batter_game_" + hitType;

        diamondStyleObject = {
          big_text: type.toUpperCase(),
          polygonClass: typeHash[type],
          textClass: 'diamondText',
          career: info[career],
          season: info[season],
          game  : info[game]
        };
      } else {
        diamondStyleObject = {
          big_text: type.toUpperCase(),
          polygonClass: 'placeholder',
          textClass: 'placeholder',
          career: 'N/A',
          season: 'N/A',
          game  : 'N/A'
        };
      }

      // console.log(diamondStyleObject);
      return diamondStyleObject;
    }

    requestDiamonds();
  });
})();
