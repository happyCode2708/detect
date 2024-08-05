import os
import shutil

def convert_and_copy_images(source_folder, target_folder):
    # Create the target folder if it doesn't exist
    if not os.path.exists(target_folder):
        os.makedirs(target_folder)
    
    # Iterate through all files in the source directory
    for filename in os.listdir(source_folder):
        # Check if the file has a .JPG extension
        if filename.endswith('.JPG'):
            # Construct the full file path
            file_path = os.path.join(source_folder, filename)
            
            # Rename the file with a lower case .jpg extension
            new_filename = filename[:-4] + '.jpg'
            new_file_path = os.path.join(source_folder, new_filename)
            
            # Rename the file
            os.rename(file_path, new_file_path)
            print(f'Renamed {filename} to {new_filename}')
            
            # Copy the renamed file to the target directory
            target_path = os.path.join(target_folder, new_filename)
            shutil.copy(new_file_path, target_path)
            print(f'Copied {new_file_path} to {target_path}')

# Example usage
source_folder = 'C:/Users/nnqduy/Desktop/ocr/detect/studio/mydata/yolo/images'  # Replace with the path to your source folder
target_folder = 'C:/Users/nnqduy/Desktop/ocr/detect/studio/export/30/images'  # Replace with the path to your target folder
convert_and_copy_images(source_folder, target_folder)
