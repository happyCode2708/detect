import cv2
import numpy as np
import random

default_padding_factor = 0.1

def crop_image(image, x, y, w, h, padding_factor=default_padding_factor,  showImage=False):
  original_image = get_image(image)
  height, width, _ = original_image.shape
  padding = min(int(width * padding_factor), int(height * padding_factor))
  
  y_top = max(0, y - int(h/2) - padding)
  y_bottom = min(height, y + int(h/2) + padding)
  x_left = max(0, x - int(w/2) - padding)
  x_right = min(width, x + int(w/2) + padding)

  cropped_image = original_image[y_top: y_bottom , x_left: x_right]

  if(showImage == True):
    show_image('Cropped Image', cropped_image)
		
  return cropped_image


class PanelContour:
    def __init__(self, inputImage, threshold, label_contour, contour_filled_mask_image):
        self.inputImage = inputImage
        self.threshold = threshold
        self.label_contour = label_contour
        self.contour_filled_mask_image = contour_filled_mask_image

def extract_contour_image(image, threshold=170):

	if(image is None):
		print('there is no image to extract contour')

	if image is not None:
		gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

		edges = cv2.Canny(gray, 30, 100)

		#* reduce noise
		blurred = cv2.GaussianBlur(edges, (3, 3), 0)
		
		laplacian = cv2.Laplacian(blurred, cv2.CV_64F, ksize=3)
		edges = cv2.convertScaleAbs(laplacian)
		
		#* reduce laplacian noise
		_, edges = cv2.threshold(edges, threshold, 255, cv2.THRESH_BINARY)
		
		# show_image('edge', edges)

		#* try to extract outer contour
		contours, hierarchy = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

		best_contour_idx = 0
		largest_contour = 0
      
		for ctIdx, contour in enumerate(contours):
			peri = cv2.arcLength(contour, True)
			approx = cv2.approxPolyDP(contour, 0.00005 * peri, True)
      
			# print('[', ctIdx, ']',len(contour), '-', len(approx), '- peri', peri)

			#* 1.1 draw all approx contours
			# cv2.drawContours(image, [approx], -1, contour_random_color, 2)
                  
			if approx is None:
				continue;

			if(peri>= largest_contour):
				largest_contour = peri
				best_contour_idx = ctIdx

            
		best_contour = contours[best_contour_idx]
      
		#* smooth contour
		best_contour = smooth_contour(best_contour) 


    #* create a mask of zeros with the same dimensions as the original image
		gray_image = image.shape[:2]
		mask = np.zeros(gray_image, dtype=np.uint8)
		
		
		#* fill the contour on the mask image
		cv2.drawContours(mask, [best_contour], -1, (255), thickness=cv2.FILLED)
      
		# show_image('Filled best contour on image', mask)

		forge_ground_area = np.sum(mask == 255)
		height, width = gray_image
		image_area = height * width
		contour_area_rate = forge_ground_area / image_area
        
		# print(contour_area_rate)

		if(contour_area_rate < 0.7): 
			return None


		# fill remaining gaps
		kernel = np.ones((5, 5), np.uint8)
		mask = cv2.dilate(mask, kernel, iterations=1)  # Dilate first to close tiny gaps
		mask = cv2.erode(mask, kernel, iterations=1)  

		masked_image = cv2.bitwise_and(image, image, mask=mask)

		# show_image('masked image', masked_image)
      
		return PanelContour(image, threshold, best_contour, masked_image)
  
	else:
		print("Error loading the cropped image.")
		return None

def adaptive_extract_contour(image, yolo_bounding_box, adapt_padding_factor=[10, 2], adapt_threshold=[0.015, 0.07]):
	origin_image = get_image(image)
	x, y, w, h = yolo_bounding_box
	
	current_padding_factor = adapt_padding_factor[0]
	current_threshold = adapt_threshold[0]
     
	done = False
	extracted_contour_result = None
      
	while current_padding_factor <= adapt_padding_factor[1] and not done:
		yolo_detected_image = crop_image(origin_image, x, y, w, h, current_padding_factor, False)
		while current_threshold >= adapt_threshold[1] and not done:
			extract_result = extract_contour_image(yolo_detected_image, current_threshold)
			is_success = extract_result is not None

			if(is_success is True):
				done = True
				extracted_contour_result = [extract_result, current_padding_factor ]
            
			current_threshold -= 2
		current_padding_factor += 0.005
		current_threshold = adapt_threshold[0]
  
	if(extracted_contour_result is None):
		return None
	else:
		return extracted_contour_result

#* show image on modal
def show_image(name, image):
	original_height, original_width = image.shape[:2]

	desired_width = 600
	ratio = desired_width / original_width
	desired_height = int(original_height * ratio)
	resized_image = cv2.resize(image, (desired_width, desired_height))
	
	cv2.imshow('name', resized_image)
	cv2.waitKey(0)
	cv2.destroyAllWindows()

def is_contour_closed(contour):
	# Check if the first point is the same as the last point
	return np.array_equal(contour[0], contour[-1])

def smooth_contour(contour, smoothing_factor=0.002):
	# Smooth the contour
	epsilon = smoothing_factor * cv2.arcLength(contour, True)
	smoothed_contour = cv2.approxPolyDP(contour, epsilon, True)

  	#* ensure the contour is closed
	if not is_contour_closed(smoothed_contour):
		# Ensure the shape of the first point is the same as other points in the contour
		first_point = smoothed_contour[0].reshape(1, -1, 2)
		smoothed_contour = np.vstack((smoothed_contour, first_point))

	return smoothed_contour

def is_string(value):
  return isinstance(value, str)

def get_image(source):
  if(is_string(source)):
    image = cv2.imread(source)
    return image
  elif (source is not None):
    return source
  else:
    return None
  
def get_random_color(index):
    return (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

def boxing_label_image(image, detected_objects):
	boxing_panels_image = get_image(image)
	for objIdx, obj in enumerate(detected_objects):
    # Calculate the xmin, ymin, xmax, ymax coordinates
		xmin = int(obj.x - obj.w / 2)
		ymin = int(obj.y - obj.h / 2)
		xmax = int(obj.x + obj.w / 2)
		ymax = int(obj.y + obj.h / 2)
    
		# Draw red rectangle around the box
		cv2.rectangle(boxing_panels_image, (xmin, ymin), (xmax, ymax), (0, 0, 255), 2)

	show_image('boxing objects', boxing_panels_image)