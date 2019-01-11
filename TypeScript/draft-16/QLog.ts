// ================================================================== //
// Interface for QLog version 0.1
// ================================================================== //

export interface IQLog {
    qlog_version: string,
    quic_version: string,
    vantagepoint: VantagePoint,
    connectionid: string,
    starttime: number,
    fields: string[],
    //TODO
    events: [
        number,
        EventCategory,
        ConnectivityEventType | TransportEventType | SecurityEventType,
        ConnectivityEventTrigger | TransporEventTrigger | SecurityEventTrigger,
        IEventData
        ][]
}

// ================================================================== //
// Based on QUIC draft 16
// ================================================================== //

export enum FrameTypeName {
    PADDING = "PADDING",
    RST_STREAM = "RST_STREAM",
    CONNECTION_CLOSE = "CONNECTION_CLOSE",
    APPLICATION_CLOSE = "APPLICATION_CLOSE",
    MAX_DATA = "MAX_DATA",
    MAX_STREAM_DATA = "MAX_STREAM_DATA",
    MAX_STREAM_ID = "MAX_STREAM_ID",
    PING = "PING",
    BLOCKED = "BLOCKED",
    STREAM_BLOCKED = "STREAM_BLOCKED",
    STREAM_ID_BLOCKED = "STREAM_ID_BLOCKED",
    NEW_CONNECTION_ID = "NEW_CONNECTION_ID",
    STOP_SENDING = "STOP_SENDING",
    RETIRE_CONNECTION_ID = "RETIRE_CONNECTION_ID",
    PATH_CHALLENGE = "PATCH_CHALLENGE",
    PATH_RESPONSE = "PATH_RESPONSE",
    STREAM = "STREAM",
    CRYPTO = "CRYPTO",
    NEW_TOKEN = "NEW TOKEN",
    ACK = "ACK",
    UNKNOWN_FRAME_TYPE = "UNKOWN_FRAME_TYPE",
}

export enum PacketType {
    INITIAL = "Initial",
    RETRY = "Retry",
    HANDSHAKE = "Handshake",
    ZERORTTPROTECTED = "0-RTT Protected",
    UNKOWN_PACKET_TYPE = "UNKOWN PACKET TYPE"
}

// ================================================================== //

export enum EventCategory {
    CONNECTIVITY = "CONNECTIVITY",
    SECURITY = "SECURITY",
    TRANSPORT = "TRANSPORT",
}

export enum ConnectivityEventType {
    NEW_CONNECTION = "NEW_CONNECTION",
}

export enum ConnectivityEventTrigger {
    LINE = "LINE"
}

export enum TransportEventType {
    TRANSPORT_PACKET_RX = "PACKET_RX",
}

export enum TransporEventTrigger {
    LINE = "LINE"
}

export enum SecurityEventType {
    KEY_UPDATE = "KEY_UPDATE"
}

export enum SecurityEventTrigger {
    KEYLOG = "KEYLOG",
}


// ================================================================== //

export enum VantagePoint {
    CLIENT = "CLIENT",
    SERVER = "SERVER",
    NETWORK = "NETWORK"
}

export enum SSLSecrets {
    QUIC_SERVER_HANDSHAKE_TRAFFIC_SECRET = "QUIC_SERVER_HANDSHAKE_TRAFFIC_SECRET",
    QUIC_CLIENT_HANDSHAKE_TRAFFIC_SECRET = "QUIC_CLIENT_HANDSHAKE_TRAFFIC_SECRET",
    QUIC_SERVER_TRAFFIC_SECRET = "QUIC_SERVER_TRAFFIC_SECRET",
    QUIC_CLIENT_TRAFFIC_SECRET = "QUIC_CLIENT_TRAFFIC_SECRET",
    ADDITIONAL_SECRET = "ADDITIONAL_SECRET"
}

// ================================================================== //
// Data Interfaces for QLog Events
// ================================================================== //

export interface IEventData {

}

export interface IEventNewConnection extends IEventData {
    ip_version: string,
    //TODO more restrictive types for IP?
    srcip: string,
    dstip: string,
    srcport: number,
    dstport: number,
}

// ================================================================== //

export interface IEventKeyUpdate extends IEventData {
    name: SSLSecrets,
    key: string
}

// ================================================================== //

export interface IEventPacketRX extends IEventData {
    raw_encrypted?: string
    header?: IEventPacketRXHeader,
    frames?: any[]
}

export interface IEventPacketRXHeader {
    form: string,
    type: string,
    version: string,
    scil: string,
    dcil: string,
    scid: string,
    dcid: string,
    payload_length: number,
    packet_number: string
}

export interface IEventPacketRXFrame {
    type: FrameTypeName,
    length: number
}

// ================================================================== //

