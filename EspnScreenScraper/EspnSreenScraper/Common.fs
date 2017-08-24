module Common

open System.Runtime.Serialization.Json
open System.IO
open System.Text
open System.Runtime.Serialization


let toJson thing =
    let serializer = new DataContractJsonSerializer(thing.GetType())

    use stream = new MemoryStream()
    serializer.WriteObject(stream, thing)
    stream.ToArray() |> Encoding.UTF8.GetString

[<DataContract>]
type HateoasLink = 
    { rel: string; href: string; }
    static member Empty = { rel = ""; href = "";}