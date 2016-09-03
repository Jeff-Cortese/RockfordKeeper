module Teams

open System.Runtime.Serialization
open FSharp.Data


type Roster = 
    { [<field: DataMember(Name="qb")>]
    QB: string;
    [<field: DataMember(Name="rb1")>]
    RB1: string;
    [<field: DataMember(Name="rb2")>]
    RB2: string;
    [<field: DataMember(Name="wr1")>]
    WR1: string;
    [<field: DataMember(Name="wr2")>]
    WR2: string;
    [<field: DataMember(Name="te")>]
    TE: string;
    [<field: DataMember(Name="flx")>]
    FLX: string;
    [<field: DataMember(Name="dst")>]
    DST: string;
    [<field: DataMember(Name="k")>]
    K: string;
    [<field: DataMember(Name="bench")>]
    Bench: string list; }
    
    static member Empty = 
        { QB = ""; 
        RB1 = "";
        RB2 = "";
        WR1 = "";
        WR2 = "";
        TE = "" ;
        FLX = "";
        DST = "";
        K = "";
        Bench = []; }

[<DataContract>]
type Team = 
    { [<field: DataMember(Name="owner")>]
    Owner: string;
    [<field: DataMember(Name="name")>]
    Name: string;
    [<field: DataMember(Name="roster")>]
    Roster: Roster; }

    static member Empty =
        { Owner = "";
        Name = "";
        Roster = Roster.Empty; }


let teams = 
    [ { Team.Empty with Owner = "Jeff"; };
    { Team.Empty with Owner = "Collin"; };
    { Team.Empty with Owner = "Josh"; };
    { Team.Empty with Owner = "Andrew"; };
    { Team.Empty with Owner = "Petey"; };
    { Team.Empty with Owner = "Erik"; };
    { Team.Empty with Owner = "Zack"; };
    { Team.Empty with Owner = "Recker"; };
    { Team.Empty with Owner = "Shannon"; };
    { Team.Empty with Owner = "Clark"; };
    { Team.Empty with Owner = "Brad"; };
    { Team.Empty with Owner = "Tad"; }; ]


let populateTeams () =
    let putTeam team =
        let json = Common.toJson team

        Http.Request("https://rockfordkeeper2015.firebaseio.com/teams/" + team.Owner + ".json", 
            httpMethod = FSharp.Data.HttpMethod.Put,
            body = HttpRequestBody.TextRequest(json)) |> ignore

    teams |> List.iter putTeam