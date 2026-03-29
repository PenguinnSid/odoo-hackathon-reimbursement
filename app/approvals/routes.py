from app.approvals import approvals_bp

@approvals_bp.route('/')
def index():
    return 'Approvals Index'
