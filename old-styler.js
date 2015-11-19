      if (type == 'sf') {

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
        game   = "runner" + baseStolen + "_game_stolen_base";
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
        var batPitString;
        if (battingOrPitching == 'batting') {
          batPitString = 'batter';
        } else {
          batPitString = 'pitcher';
        }
        var typeHash = {
          '1b': 'single',
          '2b': 'double',
          '3b': 'triple',
          'hr': 'home_run',
        };
        var hitType;
        if (info.batter_career_hit || info.pitcher_career_hit) {
          hitType = 'hit';
        } else {
          hitType = typeHash[type];
        }
        career = batPitString + "_career_" + hitType;
        season = batPitString + "_season_" + hitType;
        game   = batPitString + "_game_" + hitType;

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

      console.log(diamondStyleObject);
