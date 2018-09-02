﻿module Byes

let byesByTeam = 
    Map.empty.Add("FA", 20)
        .Add("ARI", 9)
        .Add("ATL", 8)
        .Add("BAL", 10)
        .Add("BUF", 11)
        .Add("CAR", 4)
        .Add("CHI", 5)
        .Add("CIN", 9)
        .Add("CLE", 11)
        .Add("DAL", 8)
        .Add("DEN", 10)
        .Add("DET", 6)
        .Add("GB", 7)
        .Add("HOU", 10)
        .Add("IND", 9)
        .Add("JAX", 9)
        .Add("KC", 12)
        .Add("LAC", 8)
        .Add("LAR", 2)
        .Add("MIA", 11)
        .Add("MIN", 10)
        .Add("NE", 11)
        .Add("NO", 6)
        .Add("NYG", 9)
        .Add("NYJ", 11)
        .Add("OAK", 7)
        .Add("PHI", 9)
        .Add("PIT", 7)
        .Add("SF", 11)
        .Add("SEA", 7)
        .Add("TB", 5)
        .Add("TEN", 8)
        .Add("WSH", 4)


let ByeByNickname = 
     Map.empty.Add("Jaguars", (byesByTeam.Item "JAX"))
        .Add("Falcons", (byesByTeam.Item "ATL"))
        .Add("Ravens", (byesByTeam.Item "BAL"))
        .Add("Bills", (byesByTeam.Item "BUF"))
        .Add("Panthers", (byesByTeam.Item "CAR"))
        .Add("Bears", (byesByTeam.Item "CHI"))
        .Add("Bengals", (byesByTeam.Item "CIN"))
        .Add("Browns", (byesByTeam.Item "CLE"))
        .Add("Cardinals", (byesByTeam.Item "ARI"))
        .Add("Cowboys", (byesByTeam.Item "DAL"))
        .Add("Broncos", (byesByTeam.Item "DEN"))
        .Add("Lions", (byesByTeam.Item "DET"))
        .Add("Packers", (byesByTeam.Item "GB"))
        .Add("Texans", (byesByTeam.Item "HOU"))
        .Add("Colts", (byesByTeam.Item "IND"))
        .Add("Jaguars", (byesByTeam.Item "JAX"))
        .Add("Chiefs", (byesByTeam.Item "KC"))
        .Add("Chargers", (byesByTeam.Item "LAC"))
        .Add("Rams", (byesByTeam.Item "LAR"))
        .Add("Dolphins", (byesByTeam.Item "MIA"))
        .Add("Vikings", (byesByTeam.Item "MIN"))
        .Add("Patriots", (byesByTeam.Item "NE"))
        .Add("Saints", (byesByTeam.Item "NO"))
        .Add("Giants", (byesByTeam.Item "NYG"))
        .Add("Jets", (byesByTeam.Item "NYJ"))
        .Add("Raiders", (byesByTeam.Item "OAK"))
        .Add("Eagles", (byesByTeam.Item "PHI"))
        .Add("Steelers", (byesByTeam.Item "PIT"))
        .Add("49ers", (byesByTeam.Item "SF"))
        .Add("Seahawks", (byesByTeam.Item "SEA"))
        .Add("Buccaneers", (byesByTeam.Item "TB"))
        .Add("Titans", (byesByTeam.Item "TEN"))
        .Add("Redskins", (byesByTeam.Item "WSH"))