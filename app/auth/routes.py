from flask import render_template, redirect, url_for
from app.auth import auth_bp

@auth_bp.route('/login')
def login():
    return 'Auth Login Endpoint'

@auth_bp.route('/signup')
def signup():
    return 'Auth Signup Endpoint'

@auth_bp.route('/logout')
def logout():
    return 'Auth Logout Endpoint'