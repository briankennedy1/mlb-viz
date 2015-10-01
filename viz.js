// Visualizing my MLB data with D3
(function() {
  var canvasWidth = 900,
      canvasHeight = 1200,
      dWidth  = 75,
      dHeight = 75;

  var svg = d3.select("body").append("svg");

  svg.attr("height", canvasHeight)
     .attr("width", canvasWidth);

  function drawDiamond(location, info, cssClass) {
    cssClass = cssClass || 'diamondShape';

    var x = location[0],
        y = location[1];

    var top    = x.toString() + "," + y.toString(),
        right  = (x + dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        bottom = x + "," + (y+dHeight).toString(),
        left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        points = top + " " + right + " " + bottom + " " + left;

    var big_text = info.event_cd,
        career   = info.batter_career_home_run,
        season   = info.batter_season_home_run,
        game     = info.batter_game_home_run;

    var diamond = svg.append("polygon")
                    .attr("points", points)
                    .attr('class', cssClass);
                  svg.append("text")
                      .attr("x", x-(dWidth/5))
                      .attr("y", y+(dHeight/2))
                      .text(big_text)
                      .attr('class','big-name');
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.6))
                      .text('C: ' + career )
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.7))
                      .text('S: ' + season)
                  svg.append("text")
                      .attr("x", x-(dWidth/11))
                      .attr("y", y+(dHeight*0.8))
                      .text('G: ' + game)
  return diamond;
  }

  function drawOnBoard(diamondsToBuild) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        diamondsToBuild = xhttp.responseText;
      }
    };
    xhttp.open("GET", "http://localhost:3000/v1/batting?bat_id=bondb001&event_type=home_runs&year=2001", true);
    xhttp.send();

    var diamondCount = 0,
        upMost      = [0, 0],
        rightMost   = [0, 0],
        downMost    = [0, 0],
        leftMost    = [0, 0],
        markerLeft  = [0, 0],
        markerRight = [0, 0];

    while (diamondCount < diamondsToBuild.length) {
      // Place one diamond.
      // Set upMost, leftMost, rightMost, downMost.
        if (diamondCount === 0) {
          drawDiamond(
            [450, 0],
            diamondsToBuild[diamondCount]
          );
          diamondCount += 1;

          upMost    = [450, 0];
          rightMost = [upMost[0] + dWidth/2, dHeight/2];
          downMost  = [upMost[0], dHeight];
          leftMost  = [upMost[0] - dWidth/2, dHeight/2];
        } else {
          drawLeftMost();
        }
    }

    function drawLeftMost() {
      // Place next diamond at leftMost position
      drawDiamond(
        leftMost,
        diamondsToBuild[diamondCount]
      );
      diamondCount += 1;

      if (diamondCount == diamondsToBuild.length) {return};
      // Set new leftMost position
      leftMost   = [leftMost[0] - dWidth/2, leftMost[1] + dHeight/2];
      // Set new markerLeft at diamond's right point
      markerLeft = [leftMost[0] + dWidth, leftMost[1]];
      // Move on to the right side of the diamond
      drawRightMost();
    }

    function drawRightMost() {
      // Place next diamond at rightMost position
      drawDiamond(
        rightMost,
        diamondsToBuild[diamondCount]
      );
      diamondCount += 1;

      if (diamondCount == diamondsToBuild.length) {return};
      // Set new rightMost position
      rightMost   = [rightMost[0] + dWidth/2, rightMost[1] + dHeight/2];
      // Set new markerRight at diamond's left point
      markerRight = [rightMost[0] - dWidth, rightMost[1]];

      // Move on to the left side of the diamond
      drawMarkerLeft();
    }

    function drawMarkerLeft() {
      // Place next diamond at the markerLeft position
      drawDiamond(
        markerLeft,
        diamondsToBuild[diamondCount]
      );
      diamondCount += 1;

      if (diamondCount == diamondsToBuild.length) {return};

      // If the top point of this diamond == downMost then we're done with this row
      if (markerLeft[0] == downMost[0] && markerLeft[1] == downMost[1]) {
        downMost = [downMost[0], downMost[1]+ dWidth]
        drawLeftMost();
      } else {
        // We keep going and set a new markerLeft position
        markerLeft = [markerLeft[0] + dWidth/2, markerLeft[1] + dHeight/2];
        // Head over to the right side of the diamond
        drawMarkerRight();
      }
    }

    function drawMarkerRight() {
      // Place next diamond at the markerRight position
      drawDiamond(
        markerRight,
        diamondsToBuild[diamondCount]
      );
      diamondCount += 1;

      if (diamondCount == diamondsToBuild.length) {return};
      // Set new markerRight position
      markerRight = [markerRight[0] - dWidth/2, markerRight[1] + dHeight/2];

      // Head back over to the left side of the diamond
      drawMarkerLeft();
    }

  }

  drawOnBoard();

})();
