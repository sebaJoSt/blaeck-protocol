---
sidebar_position: 10
---

# CRC32

Data frames use a CRC32 checksum to verify payload integrity. The algorithm is standard CRC-32/ISO-HDLC.

## Algorithm Parameters

| Parameter | Value |
|-----------|-------|
| Polynomial | `0x04C11DB7` |
| Initial Value | `0xFFFFFFFF` |
| XOR Out | `0xFFFFFFFF` |
| Reflect Input | `true` |
| Reflect Output | `true` |
| Size | 4 bytes |
| Byte Order | Little-endian |

This is the same CRC-32 used by Ethernet, PKZIP, and many other protocols (often called CRC-32b or CRC-32/ISO-HDLC).

## CRC Scope

The bytes included in the CRC calculation depend on the message key:

### D2

```
CRC scope: MsgKey → StatusPayload
├── MsgKey (1B)
├── ... all elements ...
├── StatusByte (1B)      ← included
└── StatusPayload (4B)   ← included
```

The CRC covers everything from the Message Key byte through the StatusPayload (inclusive).

### B1 and D1

```
CRC scope: MsgKey → last data byte
├── MsgKey (1B)
├── ... all elements ...
└── last signal DATA byte
    StatusByte (1B)      ← NOT included
```

The CRC covers from the Message Key byte through the last signal data byte. StatusByte is **not** included.

## Position in Frame

The CRC32 is always the **last 4 bytes** of the elements section, immediately before the `/BLAECK>` footer.

```
... : StatusPayload(4B) : CRC32(4B) /BLAECK>\r\n
```

## Verification

To verify a frame:

1. Extract the CRC32 from the last 4 bytes of the elements.
2. Compute CRC-32/ISO-HDLC over the appropriate byte range (see scope above).
3. Compare the computed value with the extracted CRC32.
4. If they don't match, discard the frame.

## Reference Implementation

Python (using `crcmod`):

```python
import crcmod

crc32_func = crcmod.predefined.mkCrcFun('crc-32')

def verify_d2_crc(msg_key_byte, elements_without_crc):
    """Verify CRC for a D2 frame.
    
    elements_without_crc: bytes from MsgKey through StatusPayload (excluding CRC32)
    """
    computed = crc32_func(elements_without_crc)
    return computed
```

## See Also

- [Frames](category/frames) — D2 payload layout
- [Frames](category/frames) — B1 and D1 CRC scope
- [Status Codes](status-codes) — StatusByte values included in D2 CRC
