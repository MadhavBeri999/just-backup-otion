"""
Virtual Co-Study WebSocket Signaling Server
- 2 users max, no rooms, no DB
- Pairs the first two connections automatically
- Relays WebRTC signaling (offer/answer/ice-candidate)
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

router = APIRouter()

# In-memory state (2 users only)
waiting_user: WebSocket | None = None
paired_users: list[WebSocket] = []


@router.websocket("/ws/study")
async def costudy_ws(websocket: WebSocket):
    global waiting_user

    await websocket.accept()

    partner: WebSocket | None = None

    try:
        if waiting_user is None:
            # First user → store and wait
            waiting_user = websocket
            await websocket.send_text(
                json.dumps(
                    {"type": "waiting", "message": "Waiting for another student..."}
                )
            )

            # Block until we receive messages (pairing happens when second user connects)
            while True:
                data = await websocket.receive_text()
                msg = json.loads(data)

                # Forward signaling to partner
                if msg["type"] in ("offer", "answer", "ice-candidate"):
                    if len(paired_users) == 2:
                        partner = (
                            paired_users[1]
                            if paired_users[0] == websocket
                            else paired_users[0]
                        )
                        await partner.send_text(data)

        else:
            # Second user → pair with waiting user
            partner = waiting_user
            waiting_user = None

            paired_users.clear()
            paired_users.extend([partner, websocket])

            # Tell first user: you are the initiator
            await partner.send_text(json.dumps({"type": "paired", "role": "initiator"}))

            # Tell second user: you are the receiver
            await websocket.send_text(
                json.dumps({"type": "paired", "role": "receiver"})
            )

            # Relay loop for second user
            while True:
                data = await websocket.receive_text()
                msg = json.loads(data)

                if msg["type"] in ("offer", "answer", "ice-candidate"):
                    await partner.send_text(data)

    except WebSocketDisconnect:
        # Clean up on disconnect
        if websocket in paired_users:
            paired_users.remove(websocket)

            # Notify partner
            if partner and partner in paired_users:
                try:
                    await partner.send_text(
                        json.dumps(
                            {
                                "type": "partner-disconnected",
                                "message": "User disconnected",
                            }
                        )
                    )
                except Exception:
                    pass
                paired_users.remove(partner)

        if waiting_user == websocket:
            waiting_user = None
    except Exception:
        # Safety net
        if waiting_user == websocket:
            waiting_user = None
        if websocket in paired_users:
            paired_users.remove(websocket)
