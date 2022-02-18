# TypeScript to CDDL

The original drafts of qlog were written in a TypeScript-alike format.
The later ones instead use the Concise Data Definition Language (CDDL) of [RFC8610](https://www.rfc-editor.org/rfc/rfc8610.html).
CDDL is more well-defined for this use case and an official IETF standard. 

## Approach

We want to make sure the CDDL we write is correct syntax. 
For this we will use one of several CDDL validators (see below).

To make it easier to validate all CDDL definitions for QUIC and HTTP/3 qlog,
we currently keep **all** CDDL in a single file: `qlog-0.4.cddl`.
As such, this single file can be compiled and validated in one go.

Additionally, we keep track of the old TypeScript definitions in a mirror file `qlog-0.4.ts`. 
The idea is that one can open both .cddl and .ts files side-by-side in an editor and easily compare both approaches.

The final step is then to copy the new CDDL definitions back to the I-D documents that live at [their own github repo](https://github.com/quicwg/qlog).

Once all TypeScript has been replaced, it is still best practice to first add new CDDL definitions here and validate them with the full schema, before changing the I-D documents directly!

## Tools

To validate CDDL, the recommended tool is the cddl ruby gem.
This can be installed and used in this way:

```
sudo apt update && sudo apt install ruby-full
sudo gem install cddl
cd [YOUR_CHECKOUT_DIR]/CDDL/schema/

# Will compile the CDDL and generate a valid example JSON with dummy data
cddl qlog-0.4.cddl generate

# will pretty print the generated JSON using jq
cddl qlog-0.4.cddl generate | tail +1 | jq .

# Will validate an existing JSON file against the CDDL schema
cddl qlog-0.4.cddl validate test.json
```

An alternative web-based tool that can be used just to validate the CDDL can be found at [https://cddl.anweiss.tech/](https://cddl.anweiss.tech/). This works well, but doesn't always indicate clearly where errors might be situated. 

The same author has also created a CDDL extension for the Visual Studio Code editor that provides error reporting and syntax highlighting (search CDDL in the VSCode marketplace).

## Conventions

With the move to CDDL come a few new code conventions aimed at making qlog files confirming to the CDDL schema easier to validate and generate automatically. This also makes the CDDL easier to incorporate in the I-D documents, which have line-length limits.  

### Basic syntax mapping

CDDL and TypeScript have very similar concepts for most aspects and so most schema entries are easily mappable. 

Basic types:

| TypeScript | CDDL |
| --- | --- |
| string | text |
| Array<TYPE> | [* TYPE] (if 0 or more entries)<br>[+ TYPE] (if 1 or more entries) |
| uint64 | uint64 |
| uint32 | uint |
| double | float64 |
| float | float32 |
| bytes  | hexstring |
| bool | bool |
| any | any |

Note that uint64 and hexstring are not default CDDL types but will be defined by qlog itself (not as fully new types, but more specific versions of existing CDDL types, so they will remain tooling compatible).

Other syntax differences:

|Description | TypeScript | CDDL |
| --- | --- | --- |
| comments | // this is a comment | ; this is a comment |
| Optional field | qlog_version?: string | ? qlog_version: text |
| Union type / enum<br>("Pick one of these options") | Combined:string = "option1" \| "option2" | Combined = "option1" / "option2" |
| Class/struct definition.<br>Does not require a keyword in CDDL. |  class QlogFile {<br>qlog_version:string,<br>qlog_format?:string,<br>traces: array<Trace\|TraceError><br>} | QlogFile = {<br>qlog_version: text<br>? qlog_format: text<br>? traces: [+ Trace / TraceError]<br>} |
| indicate any additional arguments | Impossible to specify formally, use a comment string | * text => any |
| Extension points | Impossible | $extendableType<br>$extendableType /= NewOption |

### Comments

Comments are now put BEFORE a given entity, instead of inline.
Comments are also _manually_ spread across multiple lines if they exceed the maximum of **69 characters**. 

Example:

```
OLD/BAD:
-------
time?: uint64 // time the event was recorded

NEW/GOOD:
--------
; time the event was recorded 
? time: uint64 
```

### Triggers

Triggers are now identified in the main definition instead of afterwards in a separate, non-committal markdown code block. 

Example:

```
OLD/BAD:
-------
Triggers:

* "backpressure" // indicates the parser cannot keep up, temporarily buffers
packet for later processing
* "keys_unavailable" // if packet cannot be decrypted because the proper keys were not yet available

NEW/GOOD:
--------
PacketBuffered = {
    ? header: PacketHeader
    ? raw: RawInfo
    ? datagram_id: uint32

    ? trigger: 
        ; indicates the parser cannot keep up and
        ; temporarily buffers packet for later processing
        "backpressure" |
        ; if packet cannot be decrypted because the proper keys 
        ; were not yet available
        "keys_unavailable"
}
```

### Event classes

Previously, event names weren't explicitly mentioned in the TypeScript definition. In CDDL, they are included. 

For this, we use a CamelCase-based naming scheme in the form of: `CategoryEventType`. 

For example, the event name `transport:packet_sent` maps to a CDDL type name of `TransportPacketSent`.

_NOTE: many other things in the TypeScript schema did have clear class names (e.g., the different Frame types like HeadersFrame or enums like ApplicationError). Those names are kept as they were._ 

Example: 

```
OLD/BAD:
-------
{
    packet_number_space?:PacketNumberSpace,
    packet_numbers?:Array<uint64>
}
    
NEW/GOOD:
--------
TransportPacketsAcked = {
    ? packet_number_space: PacketNumberSpace
    ? packet_numbers: [* uint64]
}
```

This way, we can later make well-defined lists of events and allow qlogs to be fully validated.

For example:

```
; defined in QUIC events document
TransportEvents = TransportPacketSent \ TransportPacketReceived \ ...

; $ProtocolEventBody is defined in the main document as extension point for the common qlog Event class
; this "extends" ProtocolEventBody to also allow the TransportEvents
$ProtocolEventBody \= TransportEvents
```

