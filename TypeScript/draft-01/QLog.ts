import { VantagePoint } from "../draft-16/QLog";

// ================================================================== //
// Interface for QLog version draft-01, initial for quic draft-22, but should be more tied to qlog than quic versions now
// ================================================================== //

export interface IQLog {
    qlog_version: string,
    title?:string,
    description?: string,
    summary?:any,

    traces: Array<ITrace | IError>
}

export interface IError {
    error_description: string,
    uri: string,
}

export interface ITrace {
    vantagepoint: IVantagePoint,
    title?:string,
    description?: string,

    configuration?: IConfiguration,

    common_fields?: ICommonFields,
    event_fields: string[],

    events: Array<Array<EventField>>
}

export interface IVantagePoint{
    name?: string,
    type: VantagePointType,
    flow?: VantagePointType.client | VantagePointType.server | VantagePointType.unknown // only if type === VantagePointType.NETWORK
}

export enum VantagePointType {
    client = "client",
    server = "server",
    network = "network",
    unknown = "unknown",
}

export interface IConfiguration{
    time_offset:string,
    time_units:"ms"|"us",
    original_uris: Array<string>,
}

export interface ICommonFields{
    group_id?: string,
    group_ids?: Array<any>,
    protocol_type?: string,

    reference_time?:string,

    [additionalUserSpecifiedProperty: string]: any // allow additional properties. This way, we can enforce proper types for the ones defined in the spec, see other properties
}


export type EventType = ConnectivityEventType | TransportEventType | SecurityEventType | RecoveryEventType | HTTP3EventType;
export type EventTrigger = ConnectivityEventTrigger | TransporEventTrigger | SecurityEventTrigger | RecoveryEventTrigger;

// FIXME: TODO: add something for the DATA definitions!
export type EventField = EventType | EventTrigger | EventData | number | string; // number = for the time values, string = for unknown, user-specified fields


// ================================================================== //
// Based on QUIC draft 20
// ================================================================== //

export enum EventCategory {
    connectivity = "connectivity",
    security = "security",
    transport = "transport",
    recovery = "recovery",
}

export enum ConnectivityEventType {
    connection_attempt = "connection_attempt",
    connection_new = "connection_new",
    connection_id_update = "connection_id_update",
    spin_bit_update = "spin_bit_update",
    connection_close = "connection_close"
}

export enum ConnectivityEventTrigger {
    line = "line",
}

export enum TransportEventType {
    datagram_sent = "datagram_sent",
    datagram_received = "datagram_received",
    packet_sent = "packet_sent",
    packet_received = "packet_received",
    packet_dropped = "packet_dropped",
    packet_buffered = "packet_buffered",

    stream_state_update = "stream_state_update",
    flow_control_update = "flow_control_update",

    version_update = "version_update",
    transport_parameters_update = "transport_parameters_update",
    alpn_update = "ALPN_update"
}

export enum TransporEventTrigger {
    line = "line",
    retransmit = "retransmit",
    keys_unavailable = "keys_unavailable"
}

export enum SecurityEventType {
    cipher_update = "cipher_update",

    key_update = "key_update",
    key_retire = "key_retire"
}

export enum SecurityEventTrigger {
    tls = "TLS",
    implicit = "implicit",
    remote_update = "remote_update",
    local_update = "local_update"
}

export enum RecoveryEventType {

    state_update = "state_update",
    metric_update = "metric_update",

    loss_alarm_set = "loss_alarm_set",
    loss_alarm_triggered = "loss_alarm_triggered",

    packet_lost = "packet_lost",
    packet_acknowledged = "packet_acknowledged",
    packet_retransmit = "packet_retransmit"
}

export enum RecoveryEventTrigger {
    ack_received = "ack_received",
    packet_sent = "packet_sent",
    alarm = "alarm",
    unknown = "unknown"
}


// ================================================================== //


export enum keyType {
    server_initial_secret = "server_initial_secret",
    client_initial_secret = "client_initial_secret",

    server_handshake_secret = "server_handshake_secret",
    client_handshake_secret = "client_handshake_secret",

    server_0rtt_secret = "server_0rtt_secret",
    client_0rtt_secret = "client_0rtt_secret",

    server_1rtt_secret = "server_1rtt_secret",
    client_1rtt_secret = "client_1rtt_secret"
}

// ================================================================== //
// Data Interfaces for QLog Events
// ================================================================== //

export type EventData = IEventListening | IEventConnectionNew | IEventConnectionIDUpdate | IEventSpinBitUpdate | IEventConnectionClose |
                        IEventCipherUpdate | IEventKeyUpdate | IEventKeyRetire |
                        IEventDatagramReceived | IEventDatagramSent | IEventPacketReceived | IEventPacketSent |
                        IEventMetricUpdate | IEventPacketLost |
                        IEventH3StreamStateUpdate | IEventH3StreamTypeUpdate | IEventH3FrameCreated | IEventH3FrameParsed | IEventH3DataMoved | IEventH3DataReceived | IEventH3DependencyUpdate;

// ================================================================== //
// CONNECTIVITY

export interface IEventListening {
    ip: string,
    port: number,

    quic_versions?: Array<string>,
    alpn_values?: Array<string>
}

export interface IEventConnectionNew {
    ip_version: string,
    src_ip: string,
    dst_ip: string,

    transport_protocol?: string,
    src_port: number,
    dst_port: number,

    quic_version?: string,
    src_cid?: string,
    dst_cid?: string
}

export interface IEventConnectionIDUpdate {
    src_old?: string,
    src_new?: string,

    dst_old?: string,
    dst_new?: string
}

export interface IEventSpinBitUpdate{
    state: boolean
}

export interface IEventConnectionClose {
    src_id: string
}

// ================================================================== //
// SECURITY

export interface IEventCipherUpdate {
    type: string
}

export interface IEventKeyRetire {
    type: keyType,
    key: string,
    generation?: number
}

export interface IEventKeyUpdate {
    type: keyType,
    old?: string,
    new: string,
    generation?: number
}

// ================================================================== //
// TRANSPORT

export interface IEventDatagramReceived{
    count?: number,
    byte_length:number
}

export interface IEventDatagramSent{
    count?: number,
    byte_length:number
}

export interface IEventPacketReceived {
    raw_encrypted?: string,

    type: PacketType,
    header?: IPacketHeader,
    frames?: Array<QuicFrame>
}

export interface IEventPacketSent {
    raw_encrypted?: string,

    type: PacketType,
    header?: IPacketHeader,
    frames?: Array<QuicFrame>
}

export enum PacketType {
    initial = "initial",
    handshake = "handshake",
    zerortt = "0RTT",
    onertt = "1RTT",
    retry = "retry",
    version_negotation = "version negotation",
    unknown = "unknown",
}

export interface IEventVersionUpdate{
    old:string,
    new:string
}

export interface IALPNUpdate{
    old:string,
    new:string,
}

// ================================================================== //
// RECOVERY

export interface IEventMetricUpdate {
    cwnd?: number,
    bytes_in_flight?:number,

    min_rtt?:number,
    smoothed_rtt?:number,
    latest_rtt?:number,
    max_ack_delay?:number,

    rtt_variance?:number,
    ssthresh?:number,

    pacing_rate?:number,
}

export interface IEventPacketLost {
    type:PacketType,
    packet_number:string,

    // not all implementations will keep track of full packets, so these are optional
    header?:IPacketHeader,
    frames?:Array<QuicFrame>, // see appendix for the definitions
}

// ================================================================== //
// HTTP/3

// export type HTTP3EventType = IEventH3FrameCreated | IEventH3FrameParsed | IEventH3DataMoved | IEventH3DataReceived | IEventH3DependencyUpdate;

export enum HTTP3EventType {
    stream_state_update = "stream_state_update",
    stream_type_update = "stream_type_update",
    frame_created = "frame_created",
    frame_parsed = "frame_parsed",
    data_moved = "data_moved",
    datagram_received = "data_received",
    dependency_update = "dependency_update"
}

export interface IEventH3StreamStateUpdate {

}

export interface IEventH3StreamTypeUpdate {

}

export interface IEventH3FrameCreated {
    stream_id:string,
    frame:HTTP3Frame // see appendix for the definitions,
    byte_length:string,

    raw?:string
}

export interface IEventH3FrameParsed {
    stream_id:string,
    frame:HTTP3Frame // see appendix for the definitions,
    byte_length:string,

    raw?:string
}

export interface IEventH3DataMoved {
    stream_id:string,
    offset_start:string,
    offset_end:string,

    recipient:"application"|"transport"
}

export interface IEventH3DataReceived {
    stream_id:string,
    offset_start:string,
    offset_end:string,

    source:"application"|"transport"
}

export interface IEventH3DependencyUpdate{
    stream_id:string,
    type:"added" | "moved" | "removed",

    parent_id_old?:string,
    parent_id_new?:string,

    weight_old?:number,
    weight_new?:number
}

// ================================================================== //
// Based on QUIC draft-22
// ================================================================== //


export enum QUICFrameTypeName {
    padding = "padding",
    ping = "ping",
    ack = "ack",
    reset_stream = "reset_stream",
    stop_sending = "stop_sending",
    crypto = "crypto",
    new_token = "new_token",
    stream = "stream",
    max_data = "max_data",
    max_stream_data = "max_stream_data",
    max_streams = "max_streams",
    data_blocked = "data_blocked",
    stream_data_blocked = "stream_data_blocked",
    streams_blocked = "streams_blocked",
    new_connection_id = "new_connection_id",
    retire_connection_id = "retire_connection_id",
    path_challenge = "path_challenge",
    path_response = "path_response",
    connection_close = "connection_close",
    application_close = "application_close",
    unknown_frame_type = "unkown_frame_type"
}

// TODO: potentially split in LongHeader and ShortHeader explicitly?
export interface IPacketHeader {
    form: string,
    version?: string,
    scil?: string,
    dcil?: string,
    scid?: string,
    dcid: string,
    payload_length: number,
    packet_number: string
}

export type QuicFrame = IPaddingFrame | IPingFrame | IAckFrame | IResetStreamFrame | IStopSendingFrame | ICryptoFrame | INewTokenFrame | IStreamFrame | IMaxDataFrame | IMaxStreamDataFrame | IMaxStreamsFrame | IDataBlockedFrame | IStreamDataBlockedFrame | IStreamsBlockedFrame | INewConnectionIDFrame | IRetireConnectionIDFrame | IPathChallengeFrame | IPathResponseFrame | IConnectionCloseFrame | IUnknownFrame;

export interface IPaddingFrame{
    frame_type:QUICFrameTypeName.padding;
}

export interface IPingFrame{
    frame_type:QUICFrameTypeName.ping;
}

export interface IAckFrame{
    frame_type:QUICFrameTypeName.ack;

    ack_delay:string;

    // first number is "from": lowest packet number in interval
    // second number is "to": up to and including // highest packet number in interval
    // e.g., looks like [["1","2"],["4","5"]]
    acked_ranges:Array<[string, string]>;

    ect1?:string;
    ect0?:string;
    ce?:string;
}

export interface IResetStreamFrame{
    frame_type:QUICFrameTypeName.reset_stream;

    id:string;
    error_code:ApplicationError | number;
    final_size:string;
}

export interface IStopSendingFrame{
    frame_type:QUICFrameTypeName.stop_sending;

    id:string;
    error_code:ApplicationError | number;
}

export interface ICryptoFrame{
    frame_type:QUICFrameTypeName.crypto;

    offset:string;
    length:string;
}

export interface INewTokenFrame{
    frame_type:QUICFrameTypeName.new_token,

    length:string,
    token:string,
}

export interface IStreamFrame {
    frame_type:QUICFrameTypeName.stream;

    id:string;

    // These two MUST always be set
    // If not present in the Frame type, log their default values
    offset:string;
    length:string;

    // this MAY be set any time, but MUST only be set if the value is "true"
    // if absent, the value MUST be assumed to be "false"
    fin:boolean;

    raw?:string;
}

// export interface QuicFrame {
//     type: FrameTypeName,
//     length: number
// }

export interface IMaxDataFrame{
    frame_type:QUICFrameTypeName.max_data

    maximum:string;
}

export interface IMaxStreamDataFrame{
    frame_type:QUICFrameTypeName.max_stream_data;

    id:string;
    maximum:string;
}

export interface IMaxStreamsFrame{
    frame_type:QUICFrameTypeName.max_streams;

    maximum:string;
}

export interface IDataBlockedFrame{
    frame_type:QUICFrameTypeName.data_blocked;

    limit:string;
}

export interface IStreamDataBlockedFrame{
    frame_type:QUICFrameTypeName.stream_data_blocked;

    id:string;
    limit:string;
}

export interface IStreamsBlockedFrame{
    frame_type:QUICFrameTypeName.streams_blocked;

    limit:string;
}

export interface INewConnectionIDFrame {
    frame_type:QUICFrameTypeName.new_connection_id;

    sequence_number:string;
    retire_prior_to:string;

    length:number;
    connection_id:string;

    reset_token:string;
}

export interface IRetireConnectionIDFrame{
    frame_type:QUICFrameTypeName.retire_connection_id;

    sequence_number:string;
}

export interface IPathChallengeFrame{
    frame_type:QUICFrameTypeName.path_challenge;

    data?:string;
}

export interface IPathResponseFrame{
    frame_type:QUICFrameTypeName.path_response;

    data?:string;
}

export enum ErrorSpace {
    transport_error = "transport_error",
    application_error = "application_error",
}

export interface IConnectionCloseFrame{
    frame_type:QUICFrameTypeName.connection_close;

    error_space:ErrorSpace;
    error_code:TransportError | ApplicationError | number;
    raw_error_code:number;
    reason:string;

    trigger_frame_type?:number; // TODO: should be more defined, but we don't have a FrameType enum atm...
}

export enum TransportError {
    no_error = "no_error",
    internal_error = "internal_error",
    server_busy = "server_busy",
    flow_control_error = "flow_control_error",
    stream_limit_error = "stream_limit_error",
    stream_state_error = "stream_state_error",
    final_size_error = "final_size_error",
    frame_encoding_error = "frame_encoding_error",
    transport_parameter_error = "transport_parameter_error",
    protocol_violation = "protocol_violation",
    invalid_migration = "invalid_migration",
    crypto_buffer_exceeded = "crypto_buffer_exceeded",
    crypto_error = "crypto_error",
    unknown = "unknown",
}

export interface IUnknownFrame{
    frame_type:QUICFrameTypeName.unknown_frame_type;
    raw_frame_type:number;
}


// ================================================================== //

export enum HTTP3FrameTypeName {
    data = "data",
    headers = "headers",
    priority = "priority",
    cancel_push = "cancel_push",
    settings = "settings",
    push_promise = "push_promise",
    goaway = "goaway",
    max_push_id = "max_push_id",
    duplicate_push = "duplicate_push",
    reserved = "reserved",
    unknown = "unknown",
}

export type HTTP3Frame = IDataFrame | IHeadersFrame | IPriorityFrame | ICancelPushFrame | ISettingsFrame | IPushPromiseFrame | IGoAwayFrame | IMaxPushIDFrame | IDuplicatePushFrame | IReservedFrame | IUnknownFrame;

export interface IDataFrame{
    frame_type:HTTP3FrameTypeName.data
}

export interface IHeadersFrame{
    frame_type:HTTP3FrameTypeName.headers,
    fields:Array<IHTTPHeader>
}

export interface IHTTPHeader {
    name:string,
    content:string
}

export interface IPriorityFrame{
    frame_type:HTTP3FrameTypeName.priority,

    prioritized_element_type:"request_stream"  | "push_stream" | "placeholder" | "root",
    element_dependency_type?:"stream_id"       | "push_id"     | "placeholder_id",

    exclusive:boolean,

    prioritized_element_id:string,
    element_dependency_id:string,
    weight:number

}

export interface ICancelPushFrame{
    frame_type: HTTP3FrameTypeName.cancel_push,
    id:string
}

export interface ISettingsFrame {
    frame_type:HTTP3FrameTypeName.settings,
    fields:Array<Setting>
}

export interface Setting{
    name:"SETTINGS_MAX_HEADER_LIST_SIZE" | "SETTINGS_NUM_PLACEHOLDERS",
    content:string
}

export interface IPushPromiseFrame{
    frame_type:HTTP3FrameTypeName.push_promise,
    id:string,

    fields:Array<IHTTPHeader>
}

export interface IGoAwayFrame{
    frame_type:HTTP3FrameTypeName.goaway,
    id:string
}

export interface IMaxPushIDFrame{
    frame_type:HTTP3FrameTypeName.max_push_id,
    id:string
}

export interface IDuplicatePushFrame{
    frame_type:HTTP3FrameTypeName.duplicate_push,
    id:string
}

export interface IReservedFrame{
    frame_type:HTTP3FrameTypeName.reserved,
}

export enum ApplicationError{
    http_no_error = "http_no_error",
    http_general_protocol_error = "http_general_protocol_error",
    reserved = "reserved",
    http_internal_error = "http_internal_error",
    http_request_cancelled = "http_request_cancelled",
    http_incomplete_request = "http_incomplete_request",
    http_connect_error = "http_connect_error",
    http_excessive_load = "http_excessive_load",
    http_version_fallback = "http_version_fallback",
    http_wrong_stream = "http_wrong_stream",
    http_id_error = "http_id_error",
    http_stream_creation_error = "http_stream_creation_error",
    http_closed_critical_stream = "http_closed_critical_stream",
    http_early_response = "http_early_response",
    http_missing_settings = "http_missing_settings",
    http_unexpected_frame = "http_unexpected_frame",
    http_request_rejected = "http_request_rejected",
    http_settings_error = "http_settings_error",
    http_malformed_frame = "http_malformed_frame",
    unknown = "unknown",
}