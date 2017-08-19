module Teams

open System.Runtime.Serialization
open FSharp.Data

[<DataContract>]
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
type Owner = 
    { [<field: DataMember(Name="name")>]
    Name: string;
    [<field: DataMember(Name="teamName")>]
    TeamName: string;
    [<field: DataMember(Name="roster")>]
    Roster: Roster; }

    static member Empty =
        { Name = "";
        TeamName = "";
        Roster = Roster.Empty; }


let teams = 
    [ { Owner.Empty with Name = "Jeff"; };
    { Owner.Empty with Name = "Collin"; };
    { Owner.Empty with Name = "Josh"; };
    { Owner.Empty with Name = "Andrew"; };
    { Owner.Empty with Name = "Petey"; };
    { Owner.Empty with Name = "Erik"; };
    { Owner.Empty with Name = "Zack"; };
    { Owner.Empty with Name = "Recker"; };
    { Owner.Empty with Name = "Shannon"; };
    { Owner.Empty with Name = "Dustin"; };
    { Owner.Empty with Name = "Brad"; };
    { Owner.Empty with Name = "Tad"; }; ]


let populateTeams () =
    let putTeam team =
        let json = Common.toJson team

        Http.Request("https://rockfordkeeper.firebaseio.com/owners/" + team.Name + ".json", 
            httpMethod = FSharp.Data.HttpMethod.Put,
            body = HttpRequestBody.TextRequest(json)) |> ignore

    teams |> List.iter putTeam