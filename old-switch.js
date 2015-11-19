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
      if (info.runner1_career_run) {
        diamondStyleObject = diamondStyler('run-scoring-bb-run1', info, battingOrPitching);
      } else if (info.runner2_career_run) {
        diamondStyleObject = diamondStyler('run-scoring-bb-run2', info, battingOrPitching);
      } else if (info.runner3_career_run) {
        diamondStyleObject = diamondStyler('run-scoring-bb-run3', info, battingOrPitching);
      } else if (info.batter_career_walk) {
        diamondStyleObject = diamondStyler('bb', info, battingOrPitching);
      } else if (info.runner1_career_stolen_base) {
        diamondStyleObject = diamondStyler('sb-run1', info, battingOrPitching);
      } else if (info.runner2_career_stolen_base) {
        diamondStyleObject = diamondStyler('sb-run2', info, battingOrPitching);
      } else if (info.runner3_career_stolen_base) {
        diamondStyleObject = diamondStyler('sb-run3', info, battingOrPitching);
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
      diamondStyleObject = diamondStyler('hbp', info, battingOrPitching);
      break;
    case 17:
    // Interference
      diamondStyleObject = diamondStyler('i', info, battingOrPitching);
      break;
    case 18:
    // Error
      diamondStyleObject = diamondStyler('e', info, battingOrPitching);
      break;
    case 19:
    // Fielder's Choice
      diamondStyleObject = diamondStyler('fc', info, battingOrPitching);
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
}
