from datetime import datetime
from flask import jsonify, request
from app.expenses import expenses_bp
from app.store import STATE


def _now_str():
    return datetime.now().strftime('%d %b %Y, %I:%M %p')


def _new_claim_id():
    nums = []
    for c in STATE['claims']:
        cid = str(c.get('id', ''))
        if cid.startswith('CLM-'):
            try:
                nums.append(int(cid.split('-')[1]))
            except (IndexError, ValueError):
                continue
    next_num = (max(nums) if nums else 0) + 1
    return f'CLM-{next_num:03d}'


def _find_claim_or_404(claim_id):
    for claim in STATE['claims']:
        if claim['id'] == claim_id:
            return claim
    return None


def _payload_error(message, status=400):
    return jsonify({'ok': False, 'error': message}), status


@expenses_bp.route('/claims', methods=['GET'])
def list_claims():
    role = str(request.args.get('role', '')).strip().lower()
    user_id = str(request.args.get('user_id', '')).strip()

    claims = STATE['claims']
    if role == 'employee' and user_id:
        claims = [c for c in STATE['claims'] if c.get('employeeId') == user_id]

    return jsonify({'ok': True, 'claims': claims})


@expenses_bp.route('/claims', methods=['POST'])
def create_claim():
    payload = request.get_json(silent=True) or {}
    title = str(payload.get('title', '')).strip()
    category = str(payload.get('category', '')).strip() or 'Other'
    desc = str(payload.get('desc', '')).strip()

    if not title:
        return _payload_error('Title is required.')

    try:
        amount = float(payload.get('amount') or 0)
    except (TypeError, ValueError):
        return _payload_error('Amount must be a number.')

    if amount < 0:
        return _payload_error('Amount cannot be negative.')

    claim = {
        'id': _new_claim_id(),
        'employeeId': str(payload.get('employeeId') or 'employee-demo'),
        'employee': str(payload.get('employee') or 'Employee User'),
        'title': title,
        'category': category,
        'amount': amount,
        'date': str(payload.get('date') or datetime.now().strftime('%Y-%m-%d')),
        'desc': desc,
        'receipt': str(payload.get('receipt') or ''),
        'status': str(payload.get('status') or 'submitted'),
        'comment': '',
        'timeline': payload.get('timeline') or [],
    }

    STATE['claims'].append(claim)

    role_targets = ['manager', 'finance', 'admin']
    if claim['status'] == 'draft':
        role_targets = ['employee']

    STATE['notifications'].insert(
        0,
        {
            'id': int(datetime.now().timestamp() * 1000),
            'title': f"Claim {claim['id']} created",
            'body': f"{claim['employee']} submitted {claim['title']}.",
            'time': _now_str(),
            'unread': True,
            'forRole': role_targets,
        },
    )

    return jsonify({'ok': True, 'claim': claim}), 201


@expenses_bp.route('/claims/<claim_id>/submit', methods=['PATCH'])
def submit_claim(claim_id):
    payload = request.get_json(silent=True) or {}
    actor = str(payload.get('actor') or 'Employee User')
    claim = _find_claim_or_404(claim_id)
    if not claim:
        return _payload_error('Claim not found.', status=404)

    claim['status'] = 'submitted'
    claim['timeline'].append({'action': 'Submitted', 'by': actor, 'time': _now_str()})

    STATE['notifications'].insert(
        0,
        {
            'id': int(datetime.now().timestamp() * 1000),
            'title': f'{claim_id} submitted',
            'body': f"{claim['employee']} submitted a claim for approval.",
            'time': _now_str(),
            'unread': True,
            'forRole': ['manager', 'finance', 'admin'],
        },
    )

    return jsonify({'ok': True, 'claim': claim})


@expenses_bp.route('/claims/<claim_id>/approve', methods=['PATCH'])
def manager_approve(claim_id):
    payload = request.get_json(silent=True) or {}
    actor = str(payload.get('actor') or 'Manager User')
    claim = _find_claim_or_404(claim_id)
    if not claim:
        return _payload_error('Claim not found.', status=404)

    claim['status'] = 'under-review'
    claim['timeline'].append({'action': 'Manager approved', 'by': actor, 'time': _now_str()})

    STATE['notifications'].insert(
        0,
        {
            'id': int(datetime.now().timestamp() * 1000),
            'title': f'{claim_id} approved by manager',
            'body': 'Moved to finance for final approval.',
            'time': _now_str(),
            'unread': True,
            'forRole': ['employee', 'finance', 'admin'],
        },
    )

    return jsonify({'ok': True, 'claim': claim})


@expenses_bp.route('/claims/<claim_id>/reject', methods=['PATCH'])
def reject_claim(claim_id):
    payload = request.get_json(silent=True) or {}
    actor = str(payload.get('actor') or 'Manager User')
    reason = str(payload.get('reason') or '').strip()
    if not reason:
        return _payload_error('Rejection reason is required.')

    claim = _find_claim_or_404(claim_id)
    if not claim:
        return _payload_error('Claim not found.', status=404)

    claim['status'] = 'rejected'
    claim['comment'] = reason
    claim['timeline'].append({'action': 'Rejected', 'by': actor, 'time': _now_str()})

    STATE['notifications'].insert(
        0,
        {
            'id': int(datetime.now().timestamp() * 1000),
            'title': f'{claim_id} rejected',
            'body': f'Reason: {reason}',
            'time': _now_str(),
            'unread': True,
            'forRole': ['employee', 'admin'],
        },
    )

    return jsonify({'ok': True, 'claim': claim})


@expenses_bp.route('/claims/<claim_id>/finance-approve', methods=['PATCH'])
def finance_approve(claim_id):
    payload = request.get_json(silent=True) or {}
    actor = str(payload.get('actor') or 'Finance User')

    claim = _find_claim_or_404(claim_id)
    if not claim:
        return _payload_error('Claim not found.', status=404)

    claim['status'] = 'paid'
    claim['timeline'].append(
        {'action': 'Finance approved & payment processed', 'by': actor, 'time': _now_str()}
    )

    STATE['notifications'].insert(
        0,
        {
            'id': int(datetime.now().timestamp() * 1000),
            'title': f'{claim_id} paid',
            'body': f"Payment of {claim['amount']} processed for {claim['employee']}",
            'time': _now_str(),
            'unread': True,
            'forRole': ['employee', 'admin'],
        },
    )

    return jsonify({'ok': True, 'claim': claim})


@expenses_bp.route('/notifications', methods=['GET'])
def list_notifications():
    role = str(request.args.get('role', '')).strip().lower()
    notifications = STATE['notifications']
    if role:
        notifications = [n for n in notifications if role in n.get('forRole', [])]
    return jsonify({'ok': True, 'notifications': notifications})


@expenses_bp.route('/notifications/mark-read', methods=['PATCH'])
def mark_notifications_read():
    payload = request.get_json(silent=True) or {}
    role = str(payload.get('role') or '').strip().lower()

    for notif in STATE['notifications']:
        if not role or role in notif.get('forRole', []):
            notif['unread'] = False

    return jsonify({'ok': True})