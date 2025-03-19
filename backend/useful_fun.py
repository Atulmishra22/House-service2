from werkzeug.utils import secure_filename
import os
from datetime import datetime
from backend.model import db, ServiceRequest


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
    
def reject_new_request(request):
    pid = request.professional_id
    rdate = request.date_of_request
    cdate = request.date_of_completion
    overlap_request = (
        db.session.query(ServiceRequest)
        .filter(
            ServiceRequest.professional_id == pid,
            ServiceRequest.service_status == "accepted",
            db.or_(
                db.and_(
                    ServiceRequest.date_of_request < cdate,
                    ServiceRequest.date_of_completion > rdate,
                )
            ),
        )
        .all()
    )
    if overlap_request:
        request.service_status = "rejected"
    db.session.commit()

def auto_reject_request(rid):
    request = ServiceRequest.query.get(rid)
    pid = request.professional_id
    rdate = request.date_of_request
    cdate = request.date_of_completion
    overlap_request = (
        db.session.query(ServiceRequest)
        .filter(
            ServiceRequest.professional_id == pid,
            ServiceRequest.id != rid,
            ServiceRequest.service_status.notin_(["rejected", "completed"]),
            db.or_(
                db.and_(
                    ServiceRequest.date_of_request < cdate,
                    ServiceRequest.date_of_completion > rdate,
                )
            ),
        )
        .all()
    )
    if overlap_request:
        for req in overlap_request:
            req.service_status = "rejected"
    db.session.commit()