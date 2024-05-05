import cv2
import numpy as np
import argparse
import os

def resize_and_center_image(image_path, box_size):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError(f"Image at path {image_path} could not be read.")
    h, w = image.shape[:2]
    max_width, max_height = box_size

    # Calculate the scaling factor, preserving the aspect ratio
    scale = min(max_width / w, max_height / h)

    new_size = (int(w * scale), int(h * scale))

    if(new_size[0] > max_width -50 or new_size[1] > max_width - 50):
      new_size = (int((w * 0.93 )  * scale), int((h * 0.93) * scale))
  
    
    # Resize the image
    resized_image = cv2.resize(image, new_size, interpolation=cv2.INTER_AREA)

    # Create a new image with a white background
    new_image = np.full((max_height, max_width, 3), 0, dtype=np.uint8)

    # Calculate position to center the image
    x_offset = (max_width - new_size[0]) // 2
    y_offset = (max_height - new_size[1]) // 2

    # Place the resized image onto the center of the new image
    new_image[y_offset:y_offset+new_size[1], x_offset:x_offset+new_size[0]] = resized_image

    return new_image

def create_collage(image_files, output_path):
    box_size = (600, 600)
    processed_images = [resize_and_center_image(img, box_size) for img in image_files]

    # Calculate the total width and height for the collage
    total_width = sum(img.shape[1] for img in processed_images)
    max_height = max(img.shape[0] for img in processed_images)

    # Create a new image for the collage
    collage = np.full((max_height, total_width, 3), 0, dtype=np.uint8)

    # Paste images into the collage
    x_offset = 0
    for img in processed_images:
        collage[:, x_offset:x_offset+img.shape[1]] = img
        x_offset += img.shape[1]

    cv2.imwrite(output_path, collage)

def main():
    parser = argparse.ArgumentParser(description='Create a collage from multiple images.')
    parser.add_argument('--output', type=str, required=True, help='Output file path for the collage image.')
    parser.add_argument('--input', nargs='+', required=True, help='Paths of images to include in the collage.')

    args = parser.parse_args()

    create_collage(args.input, args.output)

if __name__ == "__main__":
    main()
