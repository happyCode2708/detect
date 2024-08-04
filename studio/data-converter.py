import os
import json
import uuid

def load_class_names(class_names_path):
    with open(class_names_path, 'r') as f:
        data = json.load(f)
    return data['class_names']


def yolo_to_label_studio(images_path, labels_path, class_names):
    annotations = []
    task_id = 1
    for label_file in os.listdir(labels_path):
        if label_file.endswith('.txt'):
            image_file = label_file.replace('.txt', '.jpg')
            # image_path = os.path.join(images_path, image_file)
            image_path = os.path.join('/data/local-files/?d=images', image_file)
            
            with open(os.path.join(labels_path, label_file), 'r') as f:
                lines = f.readlines()

            bboxes = []
            for line in lines:
                parts = line.strip().split()
                class_id = int(parts[0])
                x_center = float(parts[1])
                y_center = float(parts[2])
                width = float(parts[3])
                height = float(parts[4])

                bboxes.append({
                    "original_width": 100,  # Replace with actual image width
                    "original_height": 100,  # Replace with actual image height
                    "image_rotation": 0,
                    "value": {
                        "x": (x_center - width / 2) * 100,
                        "y": (y_center - height / 2) * 100,
                        "width": width * 100,
                        "height": height * 100,
                        "rotation": 0,
                        "rectanglelabels": [class_names[class_id]]
                    },
                    "id": str(uuid.uuid4()),
                    "from_name": "label",
                    "to_name": "image",
                    "type": "rectanglelabels",
                    "origin": "manual"
                })

            annotation = {
                "id": task_id,
                "data": {
                    "image": image_path
                },
                "annotations": [
                    {
                        "id": task_id,
                        "result": bboxes,
                        "created_username": "your_username",
                        "created_ago": "0 minutes",
                        "completed_by": {
                            "id": 1,
                            "first_name": "",
                            "last_name": "",
                            "avatar": None,
                            "email": "nnqduy.spkt@gmail.com",
                            "initials": "yy"
                        },
                        "was_cancelled": False,
                        "ground_truth": False,
                        "created_at": "2024-08-04T18:56:06.873238Z",
                        "updated_at": "2024-08-04T18:56:06.873252Z",
                        "draft_created_at": "2024-08-04T18:55:45.194200Z",
                        "lead_time": 36.524,
                        "import_id": None,
                        "last_action": None,
                        "task": task_id,
                        "project": 1,
                        "updated_by": 1,
                        "parent_prediction": None,
                        "parent_annotation": None,
                        "last_created_by": None
                    }
                ],
                "predictions": []
            }

            annotations.append(annotation)
            task_id += 1

    return annotations
# Paths and class names
train_images_path = './mydata/yolo/images'
train_labels_path = './mydata/yolo/labels'
val_images_path = '/path/to/dataset/val/images'
val_labels_path = '/path/to/dataset/val/labels'
output_path = 'test_output.json'
class_names_path = './classes.json'
# class_names = ['class1', 'class2', 'class3', 'class4', 'class5']
class_names = load_class_names(class_names_path)

# Convert annotations for both train and val splits
train_annotations = yolo_to_label_studio(train_images_path, train_labels_path, class_names)
# val_annotations = yolo_to_label_studio(val_images_path, val_labels_path, class_names)

# Combine and save to a single JSON file
all_annotations = train_annotations 
# + val_annotations

with open(output_path, 'w') as f:
    json.dump(all_annotations, f, indent=4)
