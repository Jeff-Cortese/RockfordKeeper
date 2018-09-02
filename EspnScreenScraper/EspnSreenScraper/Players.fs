module Players

open canopy
open canopy.core
open FSharp.Data
open System.Runtime.Serialization
open System.Runtime.Serialization.Json
open System.IO
open System.Text
open System
open OpenQA.Selenium
open System.Globalization
open canopy.history

[<DataContract>]
type Player = 
    { [<field: DataMember(Name="espnPlayerId")>]
    EspnPlayerId: string;
    [<field: DataMember(Name="name")>]
    Name: string;
    [<field: DataMember(Name="lowerName")>]
    LowerName: string;
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
        { EspnPlayerId = "";
        Name = "";
        LowerName = "";
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
        let bye = Byes.byesByTeam.Item (team.ToUpper())
        let position = moreStuff.[1]
        let tns = String.Join(" ", (moreStuff |> Seq.skip 2))

        { Player.Empty with 
            Name = name;
            LowerName = name.ToLower();
            Team = team;
            Bye = bye;
            Position = position;
            TNS = tns; }
    else // D/ST
        let dTokens = tokens.[0].Split(' ');
        let name = dTokens.[0]
        let position = dTokens.[1]
        let bye = Byes.ByeByNickname.Item name

        { Player.Empty with
            Name = name;
            LowerName = name.ToLower();
            Bye = bye;
            Position = position; }
            


let parsePlayerRow (player: IWebElement) = 
    let espnPlayerId = player.GetAttribute("id").Substring(4)
    let rank = (elementWithin ".playertableData" player).Text |> Int32.Parse
    let playerTeamPos = (elementWithin ".playertablePlayerName" player).Text
    let projection = (elementsWithin ".playertableStat" player) |> Seq.last |> (fun elem -> if elem.Text <> "--" then elem.Text |> Double.Parse else 0.0)
    let projectedAve = projection / 13.0;
    let newPlayer = parsePlayerCell playerTeamPos
    
    { newPlayer with 
        EspnPlayerId = espnPlayerId;
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
    playerRows
    |> List.map parsePlayerRow

let parseRankedPlayers () =
    use reader = new StreamReader("2018playerRanks.txt")
    [while not reader.EndOfStream do
        let line = reader.ReadLine()
        let rank = line.Split('.').[0]
        let namePosTeam = line.Substring(rank.Length + 1).Split('\t')
        let name = namePosTeam.[0].Trim()
        let pos = namePosTeam.[1].Trim()
        let team = namePosTeam.[2].Trim()
        yield { 
            Player.Empty with 
                Name = name; 
                EspnRank = rank |> Int32.Parse; 
                Position = pos; 
                Team = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(team.ToLower());
        }
    ]

let scrapePlayerProjections () =
    [0..8]
    |> List.map (fun i ->
        url <| sprintf "http://games.espn.go.com/ffl/tools/projections?startIndex=%d" (i * 40)
        parsePage () 
        )
    |> List.concat

let joinPlayers ranked projected =
    let mutable secondaryRank = 299;
    let rankedMap: Map<string, Player> = ranked |> List.map (fun p -> p.Name.ToLower(), p) |> Map.ofList
    
    projected
    |> List.map 
        (fun player ->
            let thing = rankedMap.TryFind (player.Name.Replace("*", "").Trim().ToLower())
            let other = match thing with 
                        | Some p -> p 
                        | None -> 
                            secondaryRank <- secondaryRank + 1
                            { player with EspnRank = secondaryRank }
            { player with EspnRank = other.EspnRank; Bye = player.Bye }
        )
    |> List.sortWith (fun player1 player2 -> player1.EspnRank.CompareTo(player2.EspnRank))
    |> List.mapi (fun i p -> { p with EspnRank = i + 1 } )
    //ranked
    //|> List.map 
    //    (fun rankedPlayer ->
    //        projected
    //        |> List.find (fun projectedPlayer -> rankedPlayer.Name = projectedPlayer.Name && rankedPlayer.Position = projectedPlayer.Position && rankedPlayer.Team = projectedPlayer.Team)
    //    )


let populatePlayers () =
    start chrome
    pin types.direction.Right

    let playerRanks = parseRankedPlayers ()
    let playerProjections = scrapePlayerProjections ()
    let players = joinPlayers playerRanks playerProjections

    
    players 
    |> List.map Common.toJson
    |> List.iter postPlayer 
    |> ignore
    
    //let commadPlayers = playerRows |> List.map parsePlayerRow |> List.map (fun play -> play.toString() + Environment.NewLine)
    //let players = String.Join("", commadPlayers)
    //players
        
    //use writer = new StreamWriter("2016players.txt")
    //writer.Write(String.Join(Environment.NewLine, players))

    browser.Close()
