from pydantic import BaseModel


class UploadResponse(BaseModel):

    filename: str

    message: str

    chunks: int


class UploadItem(BaseModel):

    filename: str


class UploadListResponse(BaseModel):

    files: list[UploadItem]


class UploadDeleteResponse(BaseModel):

    filename: str

    message: str