// we use this setup to have a single "master" version to refer to for all importers, but to also be able to manually import older versions from maps
// if we add a new version, we just update this master.ts file to link to the new version
// using the latest version is as simple as
// import * as qlog from "@quictools/qlog-schema" OR import { IQLog } from "@quictools/qlog-schema"
// using a specific version (E.g., draft-16) is then:
// import * as qlog from '@quictools/qlog-schema/draft-16/QLog' 
export { 
        IQLog, 
        FrameTypeName, 
        PacketType, 
        EventCategory, 
        ConnectivityEventType, 
        ConnectivityEventTrigger, 
        TransportEventType,
        TransporEventTrigger,
        SecurityEventType,
        SecurityEventTrigger,
        SSLSecrets,
        VantagePoint,
        IEventData,
        IEventNewConnection,
        IEventKeyUpdate,
        IEventPacketRX,
        IEventPacketRXHeader,
        IEventPacketRXFrame,
    } from "../draft-16/QLog";
