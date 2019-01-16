// we use this setup to have a single "master" version to refer to for all importers, but to also be able to manually import older versions from maps
// if we add a new version, we just update this master.ts file to link to the new version
// using the latest version is as simple as
// import * as qlog from "@quictools/qlog-schema" OR import { IQLog } from "@quictools/qlog-schema"
// using a specific version (E.g., draft-16) is then:
// import * as qlog from '@quictools/qlog-schema/draft-16/QLog' 
export { 
        IQLog, 
        IConnection,
        FrameTypeName, 
        PacketType, 
        EventCategory, 
        EventType,
        EventTrigger,
        ConnectivityEventType, 
        ConnectivityEventTrigger, 
        TransportEventType,
        TransporEventTrigger,
        SecurityEventType,
        SecurityEventTrigger,
        RecoveryEventType,
        RecoveryEventTrigger,
        SSLSecrets,
        VantagePoint,
        EventData,
        IEventNewConnection,
        IEventKeyUpdate,
        IEventPacketRX,
        IPacketHeader,
        IPacketFrame,
    } from "../draft-16/QLog";
