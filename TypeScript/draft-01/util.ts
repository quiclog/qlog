import * as qlog from './QLog';

// usage:
// either : 
//      let evtw = QUtil.WrapEvent(jsonEvent) 
//      evtw.time, evt.category, etc.
//  and re-use with:
//      evtw.evt = newEvt;
// or :
//      EventTupleWrapper.time(evt) 
export class EventTupleWrapper{
    public evt!:Array<any>;

    constructor(evt:Array<any> | null){
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

    public get timeIndex() : number {
        return 0;
    }

    public get category() : qlog.EventCategory {
        return this.evt[1];
    }

    public get type() : qlog.EventType {
        return this.evt[2];
    }

    public get data() : qlog.EventData {
        return this.evt[4];
    }

    public static time(evt:Array<any>)     : number {               return evt[0] }
    public static category(evt:Array<any>) : qlog.EventCategory {   return evt[1] }
    public static type(evt:Array<any>)     : qlog.EventType {       return evt[2] }
    public static data(evt:Array<any>)     : qlog.EventData {       return evt[3] }
}

export class QUtil {
    public static WrapEvent(evt:Array<any> | null) : EventTupleWrapper {
        return new EventTupleWrapper(evt);
    }

    public static TraceContainsSingleConnection(trace:qlog.ITrace) : boolean {

        // a trace can conceptually contain more than 1 connection
        // if there is just one, we expect there to be a "group_id" in the common_fields
        // if there are more, we expect "group_id" in the event_fields
        // if there isn't a group_id anywhere, we currently also assume there is just 1 connection
        if( trace.event_fields.indexOf("group_id") >= 0 ){
            return false;
        }
        else
            return true;
    }
}
