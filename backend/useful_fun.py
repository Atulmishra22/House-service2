from werkzeug.utils import secure_filename
import os
from datetime import datetime


def file_url(file, name):
    if file and file.filename:
        filename = secure_filename(file.filename)
        path = os.path.join("./professional_verification", f"{name}_{filename}")
        os.makedirs(os.path.dirname(path), exist_ok=True)
        file.save(path)
        return path
    else:
        return None


def formatTime(dt: datetime):
    if dt:
        date_time = dt.strftime("%d/%m/%Y, %H:%M:%S")
        return date_time
    else:
        return None
