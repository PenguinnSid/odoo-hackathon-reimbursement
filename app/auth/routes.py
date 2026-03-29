from flask import jsonify, request
from app.auth import auth_bp
from app.store import ROLE_PROFILES

@auth_bp.route('/login', methods=['POST'])
def login():
    payload = request.get_json(silent=True) or {}
    requested_role = str(payload.get('role') or 'employee').strip().lower()
    role = requested_role if requested_role in ROLE_PROFILES else 'employee'
    profile = ROLE_PROFILES[role]

    return jsonify(
        {
            'ok': True,
            'user': {
                'id': f'{role}-demo',
                'role': role,
                'name': profile['name'],
                'email': profile['email'],
                'avatar': profile['avatar'],
            },
        }
    )

@auth_bp.route('/signup', methods=['POST'])
def signup():
    return jsonify({'ok': True, 'message': 'Signup endpoint is ready for integration.'})

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'ok': True})