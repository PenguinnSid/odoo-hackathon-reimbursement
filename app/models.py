from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app.extensions import db, login_manager

"""Database models and relationships for the reimbursement system"""

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


class Company(db.Model):    # DB of company details
    __tablename__ = 'companies'

    id              = db.Column(db.Integer, primary_key=True)
    name            = db.Column(db.String(255), nullable=False)
    country_code    = db.Column(db.String(10))
    currency_code   = db.Column(db.String(10))
    created_at      = db.Column(db.DateTime, default=datetime.utcnow)

    users           = db.relationship('User', back_populates='company')
    expenses        = db.relationship('Expense', back_populates='company')
    approval_rules  = db.relationship('ApprovalRule', back_populates='company')


class User(UserMixin, db.Model): # DB of user details, roles and sessions.
    __tablename__ = 'users'

    id                      = db.Column(db.Integer, primary_key=True)
    company_id              = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    name                    = db.Column(db.String(255), nullable=False)
    email                   = db.Column(db.String(255), unique=True, nullable=False)
    password_hash           = db.Column(db.String(255), nullable=False)
    role                    = db.Column(db.Enum('admin', 'manager', 'employee'), nullable=False)
    manager_id              = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    failed_login_attempts   = db.Column(db.Integer, default=0)
    locked_until            = db.Column(db.DateTime, nullable=True)
    is_active               = db.Column(db.Boolean, default=True)
    created_at              = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    company         = db.relationship('Company', back_populates='users')
    manager         = db.relationship('User', remote_side='User.id', backref='subordinates')
    expenses        = db.relationship('Expense', back_populates='submitter')
    auth_security   = db.relationship('AuthSecurity', back_populates='user', uselist=False)

    # functions for password management
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def is_locked(self):
        if self.locked_until and self.locked_until > datetime.now(timezone.utc):
            return True
        return False

    def __repr__(self):
        return f'<User {self.email} ({self.role})>'


class Receipt(db.Model): # DB of ocr receipt details
    __tablename__ = 'receipts'

    id                  = db.Column(db.Integer, primary_key=True)
    uploaded_by         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    file_path           = db.Column(db.String(500))
    file_type           = db.Column(db.String(50))
    ocr_status          = db.Column(db.Enum('pending','processing','done','failed'), default='pending')
    ocr_raw_text        = db.Column(db.Text)
    parsed_amount       = db.Column(db.Float)
    parsed_currency     = db.Column(db.String(10))
    parsed_description  = db.Column(db.String(500))
    parsed_category     = db.Column(db.String(100))
    parsed_date         = db.Column(db.Date)
    parsed_vendor       = db.Column(db.String(255))
    created_at          = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    uploader    = db.relationship('User')
    expense     = db.relationship('Expense', back_populates='receipt', uselist=False)


class Expense(db.Model): # DB of expense details, dates, currencies and status
    __tablename__ = 'expenses'

    id                          = db.Column(db.Integer, primary_key=True)
    company_id                  = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    submitted_by                = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receipt_id                  = db.Column(db.Integer, db.ForeignKey('receipts.id'), nullable=True)
    description                 = db.Column(db.String(500))
    category                    = db.Column(db.String(100))
    amount                      = db.Column(db.Float, nullable=False)
    currency_code               = db.Column(db.String(10))
    amount_in_company_currency  = db.Column(db.Float)
    expense_date                = db.Column(db.Date)
    status                      = db.Column(db.Enum('draft','pending','approved','rejected'), default='draft')
    created_at                  = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at                  = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company             = db.relationship('Company', back_populates='expenses')
    submitter           = db.relationship('User', back_populates='expenses')
    receipt             = db.relationship('Receipt', back_populates='expense')
    approval_requests   = db.relationship('ApprovalRequest', back_populates='expense')

    def __repr__(self):
        return f'<Expense {self.id} {self.amount} {self.status}>'


class ApprovalRule(db.Model): # DB of approval rules 
    __tablename__ = 'approval_rules'

    id                      = db.Column(db.Integer, primary_key=True)
    company_id              = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    name                    = db.Column(db.String(255))
    category                = db.Column(db.String(100))
    min_amount              = db.Column(db.Float)
    max_amount              = db.Column(db.Float)
    is_manager_approver     = db.Column(db.Boolean, default=False)
    condition_type          = db.Column(db.Enum('sequential','percentage','key_approver','hybrid'))
    percentage_threshold    = db.Column(db.Float)
    key_approver_id         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    created_at              = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

    company     = db.relationship('Company', back_populates='approval_rules')
    approvers   = db.relationship('ApprovalRuleApprover', back_populates='rule')
    key_approver = db.relationship('User', foreign_keys=[key_approver_id])


class ApprovalRuleApprover(db.Model): # DB of approver details
    __tablename__ = 'approval_rule_approvers'

    id              = db.Column(db.Integer, primary_key=True)
    rule_id         = db.Column(db.Integer, db.ForeignKey('approval_rules.id'), nullable=False)
    user_id         = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sequence_order  = db.Column(db.Integer, nullable=False)

    rule    = db.relationship('ApprovalRule', back_populates='approvers')
    user    = db.relationship('User')


class ApprovalRequest(db.Model): # DB of approval requests 
    __tablename__ = 'approval_requests'

    id              = db.Column(db.Integer, primary_key=True)
    expense_id      = db.Column(db.Integer, db.ForeignKey('expenses.id'), nullable=False)
    rule_id         = db.Column(db.Integer, db.ForeignKey('approval_rules.id'), nullable=False)
    approver_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    sequence_order  = db.Column(db.Integer, nullable=False)
    status          = db.Column(db.Enum('pending','approved','rejected'), default='pending')
    comment         = db.Column(db.Text)
    responded_at    = db.Column(db.DateTime, nullable=True)

    expense     = db.relationship('Expense', back_populates='approval_requests')
    approver    = db.relationship('User')


class AuditLog(db.Model): # Audit Log
    __tablename__ = 'audit_logs'

    id          = db.Column(db.Integer, primary_key=True)
    company_id  = db.Column(db.Integer, db.ForeignKey('companies.id'), nullable=False)
    user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    action      = db.Column(db.String(100), nullable=False)
    entity_type = db.Column(db.String(50))
    entity_id   = db.Column(db.Integer)
    detail      = db.Column(db.Text)
    created_at  = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))


class AuthSecurity(db.Model): # Session details
    __tablename__ = 'auth_security'

    id                      = db.Column(db.Integer, primary_key=True)
    user_id                 = db.Column(db.Integer, db.ForeignKey('users.id'), unique=True, nullable=False)
    session_token           = db.Column(db.String(255))
    session_expires_at      = db.Column(db.DateTime)
    session_ip              = db.Column(db.String(50))
    reset_token_hash        = db.Column(db.String(255))
    reset_token_expires_at  = db.Column(db.DateTime)
    reset_token_used        = db.Column(db.Boolean, default=False)
    totp_secret             = db.Column(db.String(255))
    two_factor_enabled      = db.Column(db.Boolean, default=False)
    backup_codes            = db.Column(db.Text)
    last_login_at           = db.Column(db.DateTime)
    last_login_ip           = db.Column(db.String(50))
    created_at              = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at              = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='auth_security')