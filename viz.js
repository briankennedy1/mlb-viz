// Visualizing my MLB data with D3
(function() {
  eventCodeButtonListener();
  playerSearchListener();

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

  var svg = d3.select("body").append("svg")
                             .call(zoom);

  var container = svg.append("g");

  svg.attr("height", canvasHeight)
     .attr("width", canvasWidth);


  function drawDiamond(location, info) {
    // kill all diamonds
    var cssClass = 'diamondShape';

    var x = location[0],
        y = location[1];

    var top    = x.toString() + "," + y.toString(),
        right  = (x + dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        bottom = x + "," + (y+dHeight).toString(),
        left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        points = top + " " + right + " " + bottom + " " + left;

        var big_text, career, season, game;

    switch (info.event_cd) {
      case 20:
        big_text = '1B';
        cssClass = 'single';
        career = info.batter_career_single;
        season = info.batter_season_single;
        game   = info.batter_game_single;
        break;
      case 21:
        big_text = '2B';
        cssClass = 'double';
        career = info.batter_career_double;
        season = info.batter_season_double;
        game   = info.batter_game_double;
        break;
      case 22:
        big_text = '3B';
        cssClass = 'triple';
        career = info.batter_career_triple;
        season = info.batter_season_triple;
        game   = info.batter_game_triple;
        break;
      case 23:
        big_text = 'HR';
        cssClass = 'homer';
        career = info.batter_career_home_run;
        season = info.batter_season_home_run;
        game   = info.batter_game_home_run;
        break;
      default:
        big_text = 'NA';
    }

    if (career == 1) {
      cssClass = cssClass + ' milestone';
    }
    if (career % 100 === 0) {
      cssClass = cssClass + ' milestone';
    }
    if (game == 2) {
      cssClass = cssClass + ' two';
    }
    if (game == 3) {
      cssClass = cssClass + ' three';
    }
    if (game == 4) {
      cssClass = cssClass + ' four';
    }
    if (game == 5) {
      cssClass = cssClass + ' five';
    }
    if (game == 6) {
      cssClass = cssClass + ' six';
    }

    var diamond = container.append("polygon")
                      .attr("points", points)
                      .attr('class', cssClass);
                    container.append("text")
                        .attr("x", x-(dWidth/7.5))
                        .attr("y", y+(dHeight/2.2))
                        .text(big_text)
                        .attr('class','big-name');
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.6))
                        .text('C: ' + career );
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.7))
                        .text('S: ' + season);
                    container.append("text")
                        .attr("x", x-(dWidth/11))
                        .attr("y", y+(dHeight*0.8))
                        .text('G: ' + game);
    return diamond;
  }

  function drawBoard(diamondsToBuild){
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
        drawDiamond(coords, diamondsToBuild[diamondCount]);
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

  function requestDiamonds(player_id, player_text, event_type) {
    player_id = player_id || 'poseb001';
    player_text = player_text || 'Buster Posey';
    event_type = event_type || 'triples';

    // clearDiamondBoard();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        // Parse response from API
        diamondsToBuild = JSON.parse(xhttp.responseText);
        // Draw the diamonds
        drawBoard(diamondsToBuild);
        // Stop loading spinner
        $('.sk-folding-cube').hide(function(){
          // Fade in the diamonds
          $('g').fadeIn(500);
          // Fill in the number of diamonds to the control card
          $('.controls .extra.content a').html('<i class="cubes icon"></i>' + diamondsToBuild.length + ' diamonds');
          $('.header').text(player_text);
          $('.header').attr('data-value',player_id)
        });

      }
    };
    xhttp.open("GET", "http://localhost:3000/v1/batting?bat_id=" + player_id + "&event_type=" + event_type, true);
    xhttp.send();
  }

  function playerSearchListener(){
    $('.ui.dropdown').dropdown({
      onChange: function(value, text, $selectedItem) {
        player_id = value;
        player_text = text;
        var event_type = $('.filters .button.active').attr('data-value');
        requestDiamonds(player_id, player_text, event_type);
      }
    });
  }

  function eventCodeButtonListener(){
    // Listen for clicks on '1B', '2B', etc. buttons
    $('body').on('click','.filters .button', function() {
      // Remove the active class from all buttons
      $('.filters').children().removeClass('active');
      // Add the active class to the button that was clicked on
      $(this).addClass('active');
      // Capture the search term from the button that was clicked on
      var event_type = $(this).attr('data-value');
      var player = $('.controls .header').attr('data-value');
      var player_text = $('.controls .header').text();
      requestDiamonds(player, player_text, event_type);
    });
  }

  function clearDiamondBoard() {
    $('.sk-folding-cube').show(function(){
      // Fade in the diamonds
      $('g').fadeOut(500,function(){
        $('g').children().remove();
      });
      // Fill in the number of diamonds to the control card
      $('.controls .extra.content a').html('<i class="cubes icon"></i> Loading diamonds');
      $('.controls .header').text('Loading Player');
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
