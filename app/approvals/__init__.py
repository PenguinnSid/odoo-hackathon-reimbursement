from flask import Blueprint
approvals_bp = Blueprint('approvals', __name__)
from app.approvals import routes  # noqa: F401