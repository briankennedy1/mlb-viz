// Visualizing my MLB data with D3
(function() {
  var canvasWidth = 1800,
      canvasHeight = 2400,
      dWidth  = 75,
      dHeight = 75;

  var svg = d3.select("body").append("svg");

  svg.attr("height", canvasHeight)
     .attr("width", canvasWidth);

  function drawDiamond(location, info) {
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

    if (info.batter_career_hit == 1) {
      cssClass = cssClass + ' milestone';
    }
    if (info.batter_career_single == 1) {
      cssClass = cssClass + ' milestone';
    }
    if (info.batter_career_double == 1) {
      cssClass = cssClass + ' milestone';
    }
    if (info.batter_career_triple == 1) {
      cssClass = cssClass + ' milestone';
    }
    if (info.batter_career_home_run == 1) {
      cssClass = cssClass + ' milestone';
    }

    var diamond = svg.append("polygon")
                    .attr("points", points)
                    .attr('class', cssClass);
                  svg.append("text")
                      .attr("x", x-(dWidth/7.5))
                      .attr("y", y+(dHeight/2.2))
                      .text(big_text)
                      .attr('class','big-name');
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.6))
                      .text('C: ' + career );
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.7))
                      .text('S: ' + season);
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.8))
                      .text('G: ' + game);
  return diamond;
  }

  function drawBoard(diamondsToBuild){
    var diamondCount = 0,
        diamondsToBuildCount = diamondsToBuild.length;

    // The board is the widest when the current row is equal to the square root of the number to build rounded up.
    var widestRow = Math.ceil(Math.sqrt(diamondsToBuildCount));

    // Draw diamonds while there are diamonds to build
    var rowWidth = 1, // Start at row 1. The board is a square turned 45
                      // degrees, so row width and number of diamonds in
                      // a row are the same.
        diamondsInRow = 0, // Current count of diamonds in row
        rowStart      = [900,0], // Where to start the row.
        coords        = [900,0]; // Where to start the first diamond.

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
      // Increment rowWidth
      rowWidth++;
      // Move the start of the next row down and to the left
      rowStart[0] -= dWidth/2;
      rowStart[1] += dHeight/2;
      // Set coords to the VALUE of rowStart
      coords = rowStart.slice();
    }

  }

  function requestDiamonds() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        diamondsToBuild = JSON.parse(xhttp.responseText);
        drawBoard(diamondsToBuild);
      }
    };
    xhttp.open("GET", "http://localhost:3000/v1/batting?bat_id=beltb001&event_type=doubles", true);
    xhttp.send();
  }
requestDiamonds();
})();
