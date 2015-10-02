function drawBoard(diamondsToBuild){
  var diamondCount = 0,
      diamondsToBuildCount = diamondsToBuild.length;

  // The board is the widest when the current row is equal to the square root of the number to build rounded up.
  var widestRow = Math.ceil(Math.sqrt(diamondsToBuildCount));

  // Draw diamonds while there are diamonds to build
  while (diamondCount <= diamondsToBuildCount) {
    var rowWidth = 1, // Start at row 1. The board is a square turned 45
                      // degrees, so row width and number of diamonds in
                      // a row are the same.
        diamondsInRow = 0, // Current count of diamonds in row
        coords        = [450,0]; // Where to plot current diamond. Hard coded
                                 // for first diamond
    while (rowWidth <= diamondsInRow) {
      // Draw diamond at current coords and pass JSON content as arg
      drawDiamond(coords, diamondsToBuild[diamondCount]);
      // Increment diamondCount
      diamondCount++;
      // Break out if we've drawn every diamond we need
      if (diamondCount == diamondsToBuildCount) { return; }
      // Increment diamondsInRow
      diamondsInRow++;
      // Set coords for next diamond one diamond width to the right
      coords[0] += diamondWidth;
    }
    // Increment rowWidth
    rowWidth++;

  }

}
