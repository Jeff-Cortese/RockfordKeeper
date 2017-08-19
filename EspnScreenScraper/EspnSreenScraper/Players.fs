module Players

open canopy
open canopy.core
open FSharp.Data
open System.Runtime.Serialization
open System.Runtime.Serialization.Json
open System.IO
open System.Text
open System

[<DataContract>]
type Player = 
    { [<field: DataMember(Name="name")>]
    Name: string;
    [<field: DataMember(Name="position")>]
    Position: string;
    //[<field: DataMember(Name="points2014")>]
    //Points2014: double;
    [<field: DataMember(Name="bye")>]
    Bye: int;
    [<field: DataMember(Name="espnRank")>]
    EspnRank: int;
    [<field: DataMember(Name="projection")>]
    Projection: double;
    [<field: DataMember(Name="team")>]
    Team: string;
    [<field: DataMember(Name="tns")>]
    TNS: string; 
    [<field: DataMember(Name="projectedAverage")>]
    ProjectedAverage: double; 
    [<field: DataMember(Name="isTaken")>]
    IsTaken: bool;}

    static member Empty = 
        { Name = "";
        Position = "";
        //Points2014 = 0.0;
        Bye = 20;
        EspnRank = 0;
        Projection = 0.0;
        Team = "";
        TNS = ""; 
        ProjectedAverage = 0.0; 
        IsTaken = false; }

    member this.toString () =
        let values = [this.EspnRank.ToString(); 
        this.Name; 
        this.Position; 
        this.Team;
        this.Projection.ToString();
        this.Bye.ToString();
        this.TNS]

        String.Join("\t", values)


let parsePlayerCell (cell: string) =
    let tokens = cell.Split(',')

    if tokens.Length > 1
    then
        let name = tokens.[0]
        let otherStuff = tokens.[1].Split(' ')
        let moreStuff = otherStuff |> Array.filter (fun s -> s <> "")
        let team = moreStuff.[0]
        let bye = Byes.byesByTeam.Item team
        let position = moreStuff.[1]
        let tns = String.Join(" ", (moreStuff |> Seq.skip 2))

        { Player.Empty with 
            Name = name;
            Team = team;
            Bye = bye;
            Position = position;
            TNS = tns; }
    else // D/ST
        let dTokens = tokens.[0].Split(' ');
        let name = dTokens.[0]
        let position = dTokens.[1]
        // let team = TODO
        // let bye = TODO 

        { Player.Empty with
            Name = name;
            Position = position; }
            


let parsePlayerRow player = 
    let rank = (elementWithin ".playertableData" player).Text |> Int32.Parse
    let playerTeamPos = (elementWithin ".playertablePlayerName" player).Text
    let projection = (elementsWithin ".playertableStat" player) |> Seq.last |> (fun elem -> if elem.Text <> "--" then elem.Text |> Double.Parse else 0.0)
    let projectedAve = projection / 13.0;
    let newPlayer = parsePlayerCell playerTeamPos
    
    { newPlayer with 
        EspnRank = rank; 
        Projection = projection;
        ProjectedAverage = projectedAve; }


let postPlayer playerJson =
    Http.Request("https://rockfordkeeper.firebaseio.com/players.json", 
        httpMethod = FSharp.Data.HttpMethod.Post,
        body = HttpRequestBody.TextRequest(playerJson)) |> ignore
    

let parsePage () =
    let playerTable = element "#playertable_0"
    let playerRows = elementsWithin ".pncPlayerRow" playerTable
    let playerJsons = 
        playerRows
        |> List.map (parsePlayerRow >> Common.toJson)

    playerJsons 
    |> List.iter postPlayer 
    |> ignore
    let commadPlayers = playerRows |> List.map parsePlayerRow |> List.map (fun play -> play.toString() + Environment.NewLine)
    let player = String.Join("", commadPlayers)
    player

let populatePlayers () =
    start chrome
    pin types.direction.Right

    let players = 
        [0..12]
        |> List.map (fun i ->
            url <| sprintf "http://games.espn.go.com/ffl/tools/projections?startIndex=%d" (i * 40)
            parsePage () 
            )
    use writer = new StreamWriter("2016players.txt")
    writer.Write(String.Join(Environment.NewLine, players))

    browser.Close()
