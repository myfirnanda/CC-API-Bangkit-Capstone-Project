import cv2
import numpy as np
import tensorflow as tf

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import uuid

from ..utils.object_utils import LetterBox, xywh2xyxy, scale_boxes


router = APIRouter()


@router.post("/upload/")
async def cread_upload_file(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    contens = await file.read()
    print(type(contens))
    
    