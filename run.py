# 1. Set up YOLO model
from main_source import detectNut, ocr_space
from utils import adaptive_extract_contour, show_image
from ultralytics import YOLO
import cv2

model = YOLO('best-nut-l-e100.pt') 

# image_path = 'input/skew/skew_panel_3.jpg'
# image_path = 'input/blurry/blurry_panel.jpeg'
# image_path = 'input/skew/detected_panel.png'
image_path = 'input/skew/skew_panel.jpeg'
# image_path = 'input/tdc/tdc_1.png'
# image_path = 'input/tdc/tdc_2.png'
# image_path = 'input/tdc/tdc_4.png'
# image_path = 'input/tdc/tdc_5.png'
# image_path = 'input/tdc/tdc_6.png'
# image_path = 'input/tdc/tdc_7.png'
# image_path = 'input/tdc/tdc_8.png'
# image_path = 'input/tdc/tdc_9.png'
# image_path = 'input/tdc/tdc_10.png'

# image_path = 'input/google/can_label.jpeg'
# image_path = 'input/camera/camera_1.jpeg'
# image_path = 'input/camera/camera_2.jpeg'



detected_objects = detectNut(image_path, model)



# Print the detected objects
boxing_panels_image= cv2.imread(image_path)

print('Panel count:', len(detected_objects))
for objIdx, obj in enumerate(detected_objects):
    # Calculate the xmin, ymin, xmax, ymax coordinates
    xmin = int(obj.x - obj.w / 2)
    ymin = int(obj.y - obj.h / 2)
    xmax = int(obj.x + obj.w / 2)
    ymax = int(obj.y + obj.h / 2)
    
    # Draw red rectangle around the box
    cv2.rectangle(boxing_panels_image, (xmin, ymin), (xmax, ymax), (0, 0, 255), 2)

show_image('boxing objects', boxing_panels_image)

for objIdx, obj in enumerate(detected_objects):
    print("Class:", obj.class_name)
    print("Confidence:", obj.confidence)
    print("Bounding Box (x, y, w, h):", obj.x, obj.y, obj.w, obj.h)
    print("File Path:", obj.file_path)

    bounding_box = [obj.x, obj.y, obj.w, obj.h]

    #* config adaptive setting for extracting the contour
    adapt_threshold = [10, 2]
    adapt_padding_factor = [0.015, 0.07]
  
    
    extract_contour_image_result = adaptive_extract_contour(obj.file_path, bounding_box, adapt_padding_factor, adapt_threshold)
    
    if(extract_contour_image_result is None):
      print('Found Contour does not qualify')
    else:
      [extract_result, padding_factor] = extract_contour_image_result
      imageTitle = f"result(threshold={extract_result.threshold}, padding={padding_factor})"
      show_image(imageTitle, extract_result.contour_filled_mask_image)




# 3. Perform OCR
# ocr_result = ocr_space(image_path)

# # Print the OCR result
# print("OCR Result:", ocr_result)
