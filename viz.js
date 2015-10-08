// Visualizing my MLB data with D3
(function() {
  eventCodeButtonListener();
  playerSearchListener();
  batPitButtonListener();

  var canvasWidth = 1200,
      canvasHeight = 650,
      // Set the height / width of the diamond objects
      dWidth  = 75,
      dHeight = 75;

  var zoom = d3.behavior.zoom()
      .scaleExtent([0.2, 2])
      .on("zoom", zoomed);

  var drag = d3.behavior.drag()
      .origin(function(d) { return d; })
      .on("dragstart", dragstarted)
      .on("drag", dragged)
      .on("dragend", dragended);

  var svg = d3.select(".board-container").append("svg")
      .call(zoom);

  var container = svg.append("g");

  svg.attr("height", canvasHeight)
     .attr("width", canvasWidth);


  function drawDiamond(location, info, player, event_type) {
    // kill all diamonds
    var polygonClass = 'diamondShape';
    var textClass = 'diamondText';

    var x = location[0],
        y = location[1];

    var top    = x.toString() + "," + y.toString(),
        right  = (x + dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        bottom = x + "," + (y+dHeight).toString(),
        left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        points = top + " " + right + " " + bottom + " " + left;

    var big_text, career, season, game;

    switch (event_type) {
      // Stolen bases will also be included with strikeouts, so taking a step back and using a general reference to event_type is the best route.
      case 'stolen_bases':
      big_text = 'SB';
      polygonClass = 'stolen-base';
      textClass = 'stolen-base';
      career = info.runner_career_stolen_base;
      season = info.runner_season_stolen_base;
      game   = info.runner_game_stolen_base;
      break;
    }

    switch (info.event_cd) {
      case 20:
        big_text = '1B';
        polygonClass = 'single';
        career = info.batter_career_single;
        season = info.batter_season_single;
        game   = info.batter_game_single;
        break;
      case 21:
        big_text = '2B';
        polygonClass = 'double';
        career = info.batter_career_double;
        season = info.batter_season_double;
        game   = info.batter_game_double;
        break;
      case 22:
        big_text = '3B';
        polygonClass = 'triple';
        career = info.batter_career_triple;
        season = info.batter_season_triple;
        game   = info.batter_game_triple;
        break;
      case 23:
        big_text = 'HR';
        polygonClass = 'homer';
        career = info.batter_career_home_run;
        season = info.batter_season_home_run;
        game   = info.batter_game_home_run;
        break;
    }

    if (career == 1) {
      polygonClass = polygonClass + ' milestone';
      textClass = textClass + ' milestone';
    }
    if (career % 100 === 0) {
      polygonClass = polygonClass + ' milestone';
      textClass = textClass + ' milestone';
    }

    switch (game) {
      case 2:
      polygonClass = polygonClass + ' two';
      break;
      case 3:
      polygonClass = polygonClass + ' three';
      break;
      case 4:
      polygonClass = polygonClass + ' four';
      break;
      case 5:
      polygonClass = polygonClass + ' five';
      break;
      case 6:
      polygonClass = polygonClass + ' six';
      break;
    }

    var diamond = container.append("polygon")
                      .attr("points", points)
                      .attr('class', polygonClass);
                    container.append("text")
                        .attr("x", x-(dWidth/7.5))
                        .attr("y", y+(dHeight/2.2))
                        .text(big_text)
                        .attr('class','big-name ' + textClass);
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.6))
                        .attr('class', textClass)
                        .text('C: ' + career );
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.7))
                        .attr('class', textClass)
                        .text('S: ' + season);
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.8))
                        .attr('class', textClass)
                        .text('G: ' + game);
    return diamond;
  }

  function drawBoard(diamondsToBuild,player,event_type){
    if (diamondsToBuild.length === 0) {
      console.log('no diamonds found');
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
          drawDiamond(coords, diamondsToBuild[diamondCount],player,event_type);
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
    player_id   = player_id || 'bondb001';
    player_text = player_text || 'Barry Bonds';
    event_type  = event_type || 'triples';
    battingOrPitching = battingOrPitching || 'batting';

    var apiLocation = 'http://localhost:3000/v1/';
    var id_type = battingOrPitching == 'batting' ? '?bat_id=' : '?pit_id=';
    var url = apiLocation + battingOrPitching + id_type + player_id + '&event_type='+ event_type;

    $.get(url)
      .success(function(response){
        drawBoard(response.data,response.player,response.event_type);
        $('.sk-folding-cube').hide(function(){
          // Fade in the diamonds
          $('g').fadeIn(300);
          // Fill in the number of diamonds to the control card
          $('.controls .meta').html('<i class="cubes icon"></i> ' + response.data.length + ' diamonds');
          $('.header').text(player_text);
          $('.header').attr('data-value',player_id);
          $('.filters').children().removeClass('disabled');
          $('.bat-pit-switch').children().removeClass('disabled');
          $('.search').dropdown('clear');
          $('.ui.selection.dropdown').removeClass('disabled');
        });
      })
      .error(function(response){
        console.log(response);
      });
  }

  function playerSearchListener(){
    $('.ui.dropdown').dropdown({
      onChange: function(value, text, $selectedItem) {
        if (!value) {
          return;
        } else {
          // Set player info from dropdown menu
          player_id = value;
          player_text = text;
          var event_type = $('.filters .button.active').attr('data-value');
          // Clear the diamond board first and then make the diamond request
          clearDiamondBoard(function(){
            requestDiamonds(player_id, player_text, event_type);
          });
          $('.ui.selection.dropdown').addClass('disabled');
          $('.filters').children().addClass('disabled');
        }
      }
    });
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
      // Add the active class to the button that was clicked on
      $(this).addClass('active');
      // Capture the search term from the button that was clicked on
      var event_type = $(this).attr('data-value');
      // Capture the player_id and text from .header on the controls
      var player_id = $('.controls .header').attr('data-value');
      var player_text = $('.controls .header').text();
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
        $('.controls .meta').html('<div class="ui active mini inline loader"></div>');
        $('.controls .header').text('Loading...');
        callback();
      });
  }

  function zoomed() {
    container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }

  function dragged(d) {
    d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
  }

  function dragended(d) {
    d3.select(this).classed("dragging", false);
  }

  requestDiamonds();
})();
