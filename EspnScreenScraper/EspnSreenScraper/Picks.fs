module Picks

open System.Runtime.Serialization
open FSharp.Data
open System

[<DataContract>]
type Pick =
    { [<field: DataMember(Name="round")>]
    Round: int;
    [<field: DataMember(Name="roundPick")>]
    RoundPick: int;
    [<field: DataMember(Name="overallPick")>]
    OverallPick: int;
    [<field: DataMember(Name="teamId")>]
    TeamId: string;
    [<field: DataMember(Name="playerId")>]
    PlayerId: string;
    [<field: DataMember(Name="byWayOf")>]
    ByWayOf: string; }

    static member Empty =
        { Round = 0;
        RoundPick = 0;
        OverallPick = 0;
        TeamId = "";
        PlayerId = "";
        ByWayOf = ""; }


let putPick pick =
    Http.Request("https://rockfordkeeper2015.firebaseio.com/picks/" + pick.OverallPick.ToString() + ".json", 
        httpMethod = FSharp.Data.HttpMethod.Put,
        body = (pick |> (Common.toJson >> HttpRequestBody.TextRequest))
    ) |> ignore

let populatePicks () = 
    RawPicks.picks.Replace("\r", "").Split('\n')
    |> Array.map (fun row -> row.Split(','))
    |> Array.filter (fun tokens -> not (tokens.[0].Contains "ROUND"))
    |> Array.mapi (fun i tokens -> 
        let roundPick = Int32.Parse(tokens.[0])
        let overall = Int32.Parse(tokens.[1])
        let picker = tokens.[2]
        let byWayOF = tokens.[4]
        let round = (i / 12) + 1 //assumes picks are in order

        { Pick.Empty with 
            Round = round;
            RoundPick = roundPick;
            OverallPick = overall;
            TeamId = picker;
            ByWayOf = byWayOF; }
    )
    |> Array.iter putPick
    |> ignore