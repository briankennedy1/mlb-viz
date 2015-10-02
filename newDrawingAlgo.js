function drawBoard(diamondsToBuild){
  var diamondsToBuildCount = diamondsToBuild.length;
  // The board is the widest when the number of rows is equal to the square root of the number to build rounded up.
  var widestRow = Math.ceil(Math.sqrt(diamondsToBuildCount));
}
// var widestRow = Square root of number of diamonds to build ALWAYS rounded up to whole number
// while diamondCount <= diamondsToBuild
  // var rowWidth = 1
  // var diamondsInRow = 0
  // coords = [450,0]
  // keep growing row until you hit widestRow
  // if (rowWidth <= widestRow) {
    // while (rowWidth <= diamondsInRow) {
      // drawDiamond(coords)
      // diamondCount++
      // if (diamondCount == diamondsToBuild) {return;}
      // diamondsInRow++
      // coords[0] += diamondWidth
    // }
    // Grow width of next row
    // rowWidth++
    // Set new starting coords on next row to be left and down by 1/2 diamond width
    // coords = [coords[0] - diamondWidth/2, coords[1] + diamondHeight/2]
