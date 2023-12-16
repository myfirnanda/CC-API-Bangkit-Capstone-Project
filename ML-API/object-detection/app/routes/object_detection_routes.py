import cv2
import numpy as np
import httpx
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import uuid
import os
from typing import List
from dotenv import load_dotenv
load_dotenv()

from ..utils.object_utils import (
    TFModel, process_image, 
    model_inference,post_process
    )
from ..utils.models import Ingredients


router = APIRouter()


model = TFModel()
def get_model():
    return model

@router.post("/ingredients/upload-multiple", response_model=Ingredients)
async def create_upload_files(files: List[UploadFile] = File(...), model: TFModel = Depends(get_model)):
    all_results = []

    for file in files:
        file.filename = f"{uuid.uuid4()}.jpg"
        contents = await file.read()

        numpy_image = np.frombuffer(contents, np.uint8)
        bgr_image = cv2.imdecode(numpy_image, cv2.IMREAD_COLOR)
        processed_image = process_image(bgr_image)
        output_data = model_inference(model, processed_image)
        results = post_process(output_data)

        if not results:
            continue  # Skip files with no detected objects

        final_result = {label["class_name"]: label["confidence"] for label in results}
        all_results.append(final_result)

    if not all_results:
        raise HTTPException(status_code=400, detail="No objects detected in any of the images")

    # Combine results from all images
    combined_results = {}
    for result in all_results:
        for key, value in result.items():
            if key in combined_results:
                combined_results[key] = max(combined_results[key], value)  # or some other logic to combine
            else:
                combined_results[key] = value

    req_body = {"ingredients": " ".join([item.lower() for item in combined_results.keys()]), "limit": "all"}
    RECIPE_API_URL = os.getenv('RECIPE_API_URL')

    async with httpx.AsyncClient() as client:
        rec_response = await client.post(RECIPE_API_URL, json=req_body)

    return {"ingredients": combined_results, "recommendations": rec_response.json()}
        

    

    
    