// corresponding original typescript-esque definitions for qlog
// supposed to be opened in a parallel window to qlog-0.4.cddl 
// so comparison of the two formats is easy side-by-side

class QlogFile {
    qlog_version:string,
    qlog_format?:string,
    title?:string,
    description?:string,
    summary?: Summary,
    traces: Array<Trace|TraceError>
}










class Summary {
    // list of fields with any type



}

class Configuration {
    // in ms
    time_offset:double,
    original_uris: array<string>,
    // list of fields with any type
}

class TraceError {
    error_description: string,
    // the original URI at which we attempted to find the file
    uri?: string, 
    vantage_point?: VantagePoint
}

class VantagePoint {
    name?: string,
    type: VantagePointType,
    flow?: VantagePointType
}

enum VantagePointType {
    server, // endpoint which initiates the connection.
    client, // endpoint which accepts the connection.
    network, // observer in between client and server.
    unknown
}

class Trace {
    title?: string,
    description?: string,
    configuration?: Configuration,
    common_fields?: CommonFields,
    vantage_point: VantagePoint,
    events: array<Event>


}


class CommonFields {
    time_format?:TimeFormat,
    reference_time?:double,

    protocol_type?:ProtocolType,
    group_id?:GroupID

    // any other fields are possible here
}

class TimeFormat {
    absolute,
    delta,
    relative
}

type ProtocolType = Array<string>;
type GroupID = string | uint32;

class Event {
    time: double,
    name: string,
    data: any,


    time_format?: TimeFormat,

    protocol_type?: ProtocolType,
    group_id?: GroupID,

    // list of fields with any type

}










class RawInfo {
    // the full byte length of the entity (e.g., packet or frame) 
    // including headers and trailers
    length?:uint64; 
    // the byte length of the entity's payload, 
    // without headers or trailers
    payload_length?:uint64; 

    // the contents of the full entity, 
    // including headers and trailers
    data?:bytes; 
}

{
    code?:uint32,
    message?:string
}

{
    code?:uint32,
    message?:string
}

{
    message:string
}

{
    message:string
}

{
    message:string
}

{
    name?:string,
    details?:any
}

{
    type?:string,
    message?:string
}

class TraceSeq {
    title?: string,
    description?: string,
    configuration?: Configuration,
    common_fields?: CommonFields,
    vantage_point: VantagePoint
}

class QlogFileSeq {
    qlog_format: "JSON-SEQ",

    qlog_version:string,
    title?:string,
    description?:string,
    summary?: Summary,
    trace: TraceSeq
}

















// -----------------------------------------------------------------
// END OF MAIN QLOG SPEC
// START OF QUIC EVENTS SPEC
// -----------------------------------------------------------------


