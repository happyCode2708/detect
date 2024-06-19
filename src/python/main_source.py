from ultralytics import YOLO
from PIL import Image
import cv2
import random
import json
import os
# from google.colab import drive
import requests



class DetectedObject:
    def __init__(self, file_path, class_name, x, y, w, h, confidence):
        self.file_path = file_path
        self.class_name = class_name
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.confidence = confidence




def detectNut(fileName, yoloModel):
    # Use your yoloModel to predict objects
    results = yoloModel.predict(fileName, conf = 0.7)

    output = []  # initial empty list

    for det in results:
        #print(det.path)
        file_path = det.path
        #print(det.boxes)
        for box in det.boxes:
            # Get the className, x, y , w, h, and confidence %
            #print(box)
            #print(f"Cls: {box.cls.item()}")

            # Look up the class name from the ID
            class_name = yoloModel.names[int(box.cls.item())]
            confidence = box.conf.item() * 100;

            xywh = box.xywh.cpu().numpy()[0]
            x = int(xywh[0])
            y = int(xywh[1])
            w = int(xywh[2])
            h = int(xywh[3])

            output.append(DetectedObject(file_path, class_name, x, y, w, h, confidence))

    return output

def ocr_space(image):
  url = "https://api.ocr.space/parse/image"

  payload = {
      'language': 'eng',
      'isOverlayRequired': 'true',
      'iscreatesearchablepdf': 'false',
      'issearchablepdfhidetextlayer': 'false',
      'detectOrientation': 'true',
      'OCREngine': '1'
  }
  files=[
    ('file',('CC210FC9-2734-499A-9E1C-485F969D0869.2.JPG.png',open(image,'rb'),'image/png'))
  ]
  headers = {
    'apikey': 'K89743310288957'
  }

  response = requests.request("POST", url, headers=headers, data=payload, files=files)
  response_obj = json.loads(response.text)
  print(response_obj.ParsedResults)
  return response_obj