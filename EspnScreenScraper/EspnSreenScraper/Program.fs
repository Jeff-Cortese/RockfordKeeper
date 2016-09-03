// Learn more about F# at http://fsharp.net
// See the 'F# Tutorial' project for more help.

open canopy
open System
open Players
open Picks


[<EntryPoint>]
let main argv = 

    canopy.configuration.chromeDir <- "./"

    Players.populatePlayers()
    //Teams.populateTeams();
    //Picks.populatePicks();

    0
