from flask import request, jsonify, render_template, redirect, url_for
from flask_login import login_user, logout_user, login_required, current_user
from app.auth import auth_bp
from app.extensions import db
from app.models import User, Company, AuditLog
from datetime import datetime
import requests

@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        data = request.get_json()
        user = User.query.filter_by(email=data.get('email')).first()
        if not user or not user.check_password(data.get('password', '')):
            return jsonify({'ok': False, 'error': 'Invalid email or password'})
        if user.is_locked():
            return jsonify({'ok': False, 'error': 'Account locked, try again later'})
        user.failed_login_attempts = 0
        db.session.commit()
        login_user(user)
        return jsonify({
            'ok': True,
            'role': user.role,
            'name': user.name,
            'company': user.company.name,
            'currency': user.company.currency_code
        })
    return render_template('auth/login.html')

@auth_bp.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        data = request.get_json()
        if User.query.filter_by(email=data.get('email')).first():
            return jsonify({'ok': False, 'error': 'Email already registered'})
        company = Company(
            name=data['company_name'],
            country_code=data.get('country_code'),
            currency_code=data.get('currency_code', 'INR')
        )
        db.session.add(company)
        db.session.flush()
        user = User(
            company_id=company.id,
            name=data['name'],
            email=data['email'],
            role='admin'
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.flush()
        log = AuditLog(
            company_id=company.id,
            user_id=user.id,
            action='company_created',
            entity_type='company',
            entity_id=company.id,
            detail=f'Company {company.name} created'
        )
        db.session.add(log)
        db.session.commit()
        login_user(user)
        return jsonify({
            'ok': True,
            'role': user.role,
            'name': user.name
        })
    return render_template('auth/signup.html')

@auth_bp.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({'ok': True})

@auth_bp.route('/me')
def me():
    if not current_user.is_authenticated:
        return jsonify({'ok': False}), 401
    return jsonify({
        'ok': True,
        'id': current_user.id,
        'name': current_user.name,
        'role': current_user.role,
        'company': current_user.company.name,
        'currency': current_user.company.currency_code
    })

@auth_bp.route('/countries')
def countries():
    try:
        res = requests.get(
            'https://restcountries.com/v3.1/all?fields=name,currencies',
            timeout=5
        )
        data = res.json()
        result = []
        for country in data:
            currencies = country.get('currencies', {})
            if not currencies:
                continue
            currency_code = list(currencies.keys())[0]
            currency_name = currencies[currency_code].get('name', '')
            result.append({
                'country': country['name']['common'],
                'currency_code': currency_code,
                'currency_name': currency_name
            })
        result = sorted(result, key=lambda x: x['country'])
        return jsonify({'ok': True, 'countries': result})
    except Exception as e:
        return jsonify({'ok': False, 'error': str(e)})