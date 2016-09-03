module Common

open System.Runtime.Serialization.Json
open System.IO
open System.Text


let toJson thing =
    let serializer = new DataContractJsonSerializer(thing.GetType())

    use stream = new MemoryStream()
    serializer.WriteObject(stream, thing)
    stream.ToArray() |> Encoding.UTF8.GetString