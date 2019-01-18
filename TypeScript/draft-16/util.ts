import { PacketType, FrameTypeName, IEventTuple, EventCategory, EventType, EventTrigger, EventData } from './QLog'

// usage:
// either : 
//      let evtw = QUtil.WrapEvent(jsonEvent) 
//      evtw.time, evt.category, etc.
//  and re-use with:
//      evtw.evt = newEvt;
// or :
//      EventTupleWrapper.time(evt) 
export class EventTupleWrapper{
    public evt!:IEventTuple;

    constructor(evt:IEventTuple | null){
        // if null you need to make sure to assign it yourself before using stuff
        // makes usage easier without having to create multiple instances
        // e.g.,
        // let wrap = new EventTupleWrapper(null);
        // for( let evt of events ){
        //      wrap.evt = evt;
        //      wrap.time ... 
        if( evt !== null )
            this.evt = evt; 
    }

    public get time() : number {
        return this.evt[0];
    }

    public get category() : EventCategory {
        return this.evt[1];
    }

    public get type() : EventType {
        return this.evt[2];
    }

    public get trigger() : EventTrigger {
        return this.evt[3];
    }

    public get data() : EventData {
        return this.evt[4];
    }

    public static time(evt:IEventTuple)     : number {          return evt[0] }
    public static category(evt:IEventTuple) : EventCategory {   return evt[1] }
    public static type(evt:IEventTuple)     : EventType {       return evt[2] }
    public static trigger(evt:IEventTuple)  : EventTrigger {    return evt[3] }
    public static data(evt:IEventTuple)     : EventData {       return evt[4] }
}

export class QUtil {
    public static WrapEvent(evt:IEventTuple | null) : EventTupleWrapper {
        return new EventTupleWrapper(evt);
    }
}
