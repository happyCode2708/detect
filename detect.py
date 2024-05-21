# import torch
# import json
# from PIL import Image

import json
from main_source import detectNut, ocr_space
from utils import adaptive_extract_contour, show_image
from ultralytics import YOLO
import cv2
import sys

# def load_model(model_path):
#     model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path)
#     return model

# def detect(model, image_path):
#     img = Image.open(image_path)
#     results = model(img)
#     return results.pandas().xyxy[0].to_json(orient="records")
model = YOLO('best-nut-l-e100.pt') 

if __name__ == "__main__":
    image_path = sys.argv[1]
    # model = load_model(model_path)
    detected_objects = detectNut(image_path, model)

    if len(detected_objects) < 1:
        print('```false```');
    else:
        # print(json.dumps(detected_objects))
        print('```true```')

    # boxing_panels_image= cv2.imread(image_path)
    
    # for objIdx, obj in enumerate(detected_objects):
    # # Calculate the xmin, ymin, xmax, ymax coordinates
    #     xmin = int(obj.x - obj.w / 2)
    #     ymin = int(obj.y - obj.h / 2)
    #     xmax = int(obj.x + obj.w / 2)
    #     ymax = int(obj.y + obj.h / 2)
    #     print('box', obj.x, obj.y, obj.w, obj.h)
    
    #     # Draw red rectangle around the box
    #     cv2.rectangle(boxing_panels_image, (xmin, ymin), (xmax, ymax), (0, 0, 255), 2)

    # show_image('boxing objects', boxing_panels_image)