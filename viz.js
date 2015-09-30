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
    var x = location[0],
        y = location[1];

    var top    = x.toString() + "," + y.toString(),
        right  = (x + dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        bottom = x + "," + (y+dHeight).toString(),
        left   = (x - dWidth/2).toString() + "," + (y + dHeight/2).toString(),
        cssClass = cssClass || 'diamondShape',
        points = top + " " + right + " " + bottom + " " + left;

    var big_text = info[0],
        career   = info[1],
        season   = info[2],
        game     = info[3];

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
  var diamondsToBuild = [
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],
    [['HR','503','5','2']],

    ];

  var upMost      = [0, 0],
      rightMost   = [0, 0],
      downMost    = [0, 0],
      leftMost    = [0, 0],
      markerLeft  = [0, 0],
      markerRight = [0, 0];

  var diamondCount = 0;
  while (diamondCount < diamondsToBuild.length) {
    // Place one diamond.
    // Set topMost, leftMost, rightMost, downMost.
    if (diamondCount == 0) {
      drawDiamond(
        [450, 0],
        diamondsToBuild[diamondCount][0],
        diamondsToBuild[diamondCount][1]
      );
      diamondCount += 1;

      upMost    = [450, 0];
      rightMost = [upMost[0] + dWidth/2, dHeight/2],
      downMost  = [upMost[0], dHeight],
      leftMost  = [upMost[0] - dWidth/2, dHeight/2];
    } else {
      // Place next diamond at leftMost.
      // Set new leftMost
      // Set new markerLeft at diamond's right point
      //
      drawLeftMost();
      function drawLeftMost() {
        drawDiamond(
          leftMost,
          diamondsToBuild[diamondCount][0],
          diamondsToBuild[diamondCount][1]
        );
        diamondCount += 1;
        console.log('drawLeftMost Drawing ' + diamondCount + 'th diamond');

        if (diamondCount == diamondsToBuild.length) {return};
        leftMost   = [leftMost[0] - dWidth/2, leftMost[1] + dHeight/2];
        markerLeft = [leftMost[0] + dWidth, leftMost[1]];
        drawRightMost();
      }

      // Place next diamond at rightMost.
      // Set new rightMost
      // Set new markerRight at diamond's left point
      //
      function drawRightMost() {
        drawDiamond(
          rightMost,
          diamondsToBuild[diamondCount][0],
          diamondsToBuild[diamondCount][1]
        );
        diamondCount += 1;
        console.log('drawRightMost Drawing ' + diamondCount + 'th diamond');

        if (diamondCount == diamondsToBuild.length) {return};
        rightMost   = [rightMost[0] + dWidth/2, rightMost[1] + dHeight/2];
        markerRight = [rightMost[0] - dWidth, rightMost[1]];

        // return rightMost, markerRight, diamondCount;
        drawMarkerLeft();
      }



      // Place next diamond at markerLeft
      //   If top point of diamond == downMost then we're done with this row
      //   Else set markerLeft at diamond's right point
      //

      function drawMarkerLeft() {
        drawDiamond(
          markerLeft,
          diamondsToBuild[diamondCount][0],
          diamondsToBuild[diamondCount][1]
        );
        diamondCount += 1;
        console.log('drawMarkerLeft Drawing ' + diamondCount + 'th diamond');

        if (diamondCount == diamondsToBuild.length) {return};

        if (markerLeft[0] == downMost[0] && markerLeft[1] == downMost[1]) {
          console.log(diamondCount + 'th diamond ends this row, starting a new one');
          downMost = [downMost[0], downMost[1]+ dWidth]
          drawLeftMost();
        } else {
          markerLeft = [markerLeft[0] + dWidth/2, markerLeft[1] + dHeight/2];
          console.log(markerLeft);
          console.log(downMost);
          drawMarkerRight();
        }
      }

      function drawMarkerRight() {
        drawDiamond(
          markerRight,
          diamondsToBuild[diamondCount][0],
          diamondsToBuild[diamondCount][1]
        );
        diamondCount += 1;
        console.log('drawMarkerRight Drawing ' + diamondCount + 'th diamond');

        if (diamondCount == diamondsToBuild.length) {return};
        markerRight = [markerRight[0] - dWidth/2, markerRight[1] + dHeight/2];

        drawMarkerLeft();
        // return markerLeft, diamondCount;
      }

    };
  }
  }

  drawOnBoard();
  //   drawDiamond([450,50], ['HR','500','123','1']);
  //   drawDiamond([350,150],['HR','501','124','1']);
  //   drawDiamond([550,150],['HR','502','125','1']);
  //   drawDiamond([450,250],['HR','503','126','2']);

})();
