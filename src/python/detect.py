import json
from main_source import detectNut, ocr_space
from utils import adaptive_extract_contour, show_image
from ultralytics import YOLO
import cv2
import sys

model = YOLO('best-nut-l-e100.pt') 

if __name__ == "__main__":
    image_path = sys.argv[1]
    detected_objects = detectNut(image_path, model)

    if len(detected_objects) < 1:
        print('```false```');
    else:
        print('```true```')
