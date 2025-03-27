import cv2 as cv
import numpy as np

def get_finding(model, img_dir):
    img = cv.imread(img_dir, cv.IMREAD_GRAYSCALE)
    img = cv.cvtColor(img, cv.COLOR_GRAY2RGB)
    img = cv.resize(img, (224, 224), interpolation=cv.INTER_AREA)

    pred = model.predict(np.expand_dims(img, axis=0))[0]

    predictions = {
        'Atelectasis': {'probability': float(pred[0]), 'description': 'The complete or partial collapse of a lung. It is caused by a blockage of the air passages or by compression of the lung.'},
        'Cardiomegaly': {'probability': float(pred[1]), 'description': 'Enlargement of the heart, where muscles of a chamber or the whole heart become abnormally thick or overly stretched. Can indicate various underlying conditions.'},
        'Consolidation': {'probability': float(pred[2]), 'description': 'The presence of material such as pus, blood, water, and cells in the small air sacs of the lungs.'},
        'Edema': {'probability': float(pred[3]), 'description': 'The buildup of fluid in the lungs. Can be associated with a heart disease or damage to lung tissue.'},
        'Enlarged Cardiomediastinum': {'probability': float(pred[4]), 'description': 'When the silhouette of the heart exceeds a normal diameter, indicating cardiomegaly.'},
        'Fracture': {'probability': float(pred[5]), 'description': 'A partial or complete break in a bone.'},
        'Lung Lesion': {'probability': float(pred[6]), 'description': 'An abnormal growth (nodule of ≤ 3 cm, mass of > 3 cm) that forms in a lung. Can be associated with infection, benign tumors, or malignancy.'},
        'Lung Opacity': {'probability': float(pred[7]), 'description': 'The presence of denser, cloudy gray areas on the x-ray image against a normal dark-appearing lung.  Gray areas indicate that something is occupying that area inside the lungs.'},
        'No Finding': {'probability': float(pred[8]), 'description': 'No abnormality detected.'},
        'Pleural Effusion': {'probability': float(pred[9]), 'description': 'The buildup of fluid within the pleural cavity located between the lung and chest lining. Can indicate an infection, malignancy, or inflammation.'},
        'Pleural Other': {'probability': float(pred[10]), 'description': 'Abnormality affecting the thin layers of tissue (pleura) that line the lungs and the chest cavity. It may be caused by viral infections, congestive heart failure, tuberculosis, or acute lung injury.'},
        'Pneumonia': {'probability': float(pred[11]), 'description': 'Inflammation of the lungs due to bacterial, viral, or fungal infection.The air sacs may fill with fluid or pus causing cough, fever, chills, and difficulty breathing.'},
        'Pneumothorax': {'probability': float(pred[12]), 'description': 'A partially or fully collapsed lung due to pressure from accumulation of air within the pleural cavity between the lungs and chest wall. It may be caused by trauma, like a blow to the chest, lung disease, or occur spontaneously.'},
        'Support Devices': {'probability': float(pred[13]), 'description': 'An implanted device that assists and improves a person’s functioning.'},
    }

    # Sort the predictions based on probability
    sorted_predictions = sorted(predictions.items(), key=lambda x: x[1]['probability'], reverse=True)

    # Extract the top two diagnoses
    top_diagnosis = sorted_predictions[0][0]
    second_diagnosis = sorted_predictions[1]

    return {'top_diagnosis': top_diagnosis, 'predictions': predictions}
