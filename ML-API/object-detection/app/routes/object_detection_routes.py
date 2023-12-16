import cv2
import numpy as np
import tensorflow as tf
import requests

from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
import uuid

from ..utils.object_utils import LetterBox, xywh2xyxy, scale_boxes


router = APIRouter()

interpreter = tf.lite.Interpreter("app/ml/YOLO_V8s.tflite")
interpreter.allocate_tensors()



@router.post("/upload/")
async def cread_upload_file(file: UploadFile = File(...)):
    file.filename = f"{uuid.uuid4()}.jpg"
    contens = await file.read()
        
    numpy_image = np.frombuffer(contens, np.uint8)
    
    bgr_image = cv2.imdecode(numpy_image, cv2.IMREAD_COLOR)

    im = [LetterBox(640, auto=False, stride=16)(image=bgr_image)]
    im = np.stack(im)
    im = im[..., ::-1].transpose((0, 1, 2, 3))  # BGR to RGB, BHWC to BCHW, (n, 3, h, w)
    im = np.ascontiguousarray(im)  # contiguous
    im = im.astype(np.float32)
    im /= 255
    
    # Set input tensor
    input_details = interpreter.get_input_details()
    interpreter.set_tensor(input_details[0]['index'], im)
    
    interpreter.invoke()

    # Process output data
    output_details = interpreter.get_output_details()
    output_data = interpreter.get_tensor(output_details[0]['index'])

# Post-process output_data to get predictions
    nc = 0
    conf_thres = 0.01
    bs = output_data.shape[0]
    nc = nc or (output_data.shape[1] - 4)
    nm = output_data.shape[1] - nc - 4
    mi = 4 + nc
    xc = np.amax(output_data[:, 4:mi], 1) > conf_thres

    multi_label = False
    multi_label &= nc > 1

    prediction = np.transpose(output_data, (0, -1, -2))
    prediction[..., :4] = xywh2xyxy(prediction[..., :4])
    output = [np.zeros((0, 6 + nm))] * bs

    max_nms = 30000
    agnostic = False
    max_wh = 7680
    iou_thres = 0.5
    max_det = 300

    for xi, x in enumerate(prediction):
        x = x[xc[xi]]

        if not x.shape[0]:
            continue

        box = x[:, :4]
        cls = x[:, 4:4 + nc]
        mask = x[:, 4 + nc:4 + nc + nm]

        conf = np.max(cls, axis=1, keepdims=True)
        j = np.argmax(cls, axis=1, keepdims=True)

        x = np.concatenate((box, conf, j.astype(float), mask), axis=1)

        conf_flat = conf.flatten()
        filtered_x = x[conf_flat > conf_thres]

        n = filtered_x.shape[0]

        if not n:
            continue
        if n > max_nms:
            sorted_indices = np.argsort(x[:, 4])[::-1]
            x = x[sorted_indices[:max_nms]]

        c = x[:, 5:6] * (0 if agnostic else max_wh)
        boxes, scores = x[:, :4] + c, x[:, 4]
        i = cv2.dnn.NMSBoxes(boxes, scores, score_threshold=0.01, nms_threshold=iou_thres)
        i = i[:max_det]
        output[xi] = x[i]

    results = []
    class_names = [
        "Egg", "Tomato", "Zucchini", "Almond", "Apple", "Banana", "Broccoli",
        "Butter", "Cabbage", "Carrot", "Cauliflower", "Cheese", "Cherry",
        "Chili", "Coconut", "Cucumber", "Dark-Chocolate", "Eggplant", "Grape",
        "Kiwi", "Mango", "Melon", "Orange", "Pear", "Pineapple", "Pomegranate",
        "Potato", "Strawberry", "Wallnut", "Watermelon", "White-Chocolate"
    ]  
    
    for result in output:
        for detection in result:
            _, _, _, _, conf, class_id = detection
            class_name = class_names[int(class_id)]
            results.append({"class_name": class_name, "confidence": conf})

    final_result = {}
    for label in results:
        print(f"{label['class_name']}: {label['confidence']:.2f}") 
        
        final_result[label["class_name"]] = label["confidence"]
    
    print(" ".join(final_result.keys()))
    r = "https://eatwise-recipe-recommendation-api-j4c7qkx47q-et.a.run.app/recommend-recipes/predict/"
    req_body = {
        "ingredients": " ".join(final_result.keys()),
        "limit": 5
    }
    
    rec_recommend = requests.post(r, json=req_body)
    print(rec_recommend.json())
    
    return final_result
        
    # return decoded_image


    
    