from fastapi import APIRouter
from fastapi.responses import StreamingResponse

import time

router = APIRouter()


def fake_stream():

    words = [
        "Hello",
        " ",
        "Anoop",
        "!",
        "\n",
        "Welcome",
        " ",
        "to",
        " ",
        "Streaming"
    ]

    for word in words:

        yield word

        time.sleep(0.3)


@router.get("/stream")

def stream():

    return StreamingResponse(
        fake_stream(),
        media_type="text/plain"
    )