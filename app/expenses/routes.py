from app.expenses import expenses_bp

@expenses_bp.route('/')
def index():
    return 'Expenses Index'