# odoo-hackathon-reimbursement
Repository for the Odoo X VIT Hackathon
# ReimburseFlow — Expense Reimbursement Management

A multi-role expense reimbursement system with multi-level approval workflows, OCR receipt scanning, and currency conversion.

---

## Requirements

- Python 3.10+
- MySQL 8.0+

---

## Setup Instructions

1. Clone the repository
git clone https://github.com/PenguinnSid/odoo-hackathon-reimbursement.git
cd odoo-hackathon-reimbursement

2. Create and activate virtual environment
python -m venv venv

Windows
venv\Scripts\activate.bat

Mac/Linux
source venv/bin/activate

3. Install dependencies
pip install -r requirements.txt

4. Set up the database
Open MySQL and run:

mysql -u root -p
CREATE DATABASE reimbursement_db;
EXIT;

Then import the schema:
mysql -u root -p reimbursement_db < schema.sql

5. Create your .env file
Copy the example and fill in your details:

cp .env.example .env

Edit .env:
SECRET_KEY= randomstring
DB_USER=root
DB_PASS=your_mysql_password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=reimbursement_db

### 6. Run the App
flask run

Open http://127.0.0.1:5000 in your browser.

---

## Features

- Multi-role auth — Admin, Manager, Employee
- Expense submission with multi-currency support
- OCR receipt scanning
- Multi-level approval workflows
- Conditional approval rules (sequential, percentage, key approver, hybrid)
- Audit logging
- Currency conversion

---

## Project Structure

app/
  auth/         — login, signup, logout
  expenses/     — submit, history, OCR
  approvals/    — approve, reject, workflow engine
  admin/        — user management, approval rules
  templates/    — Jinja2 HTML templates
  static/       — CSS, JS, uploaded receipts
models.py       — all database models
schema.sql      — raw SQL schema
requirements.txt
.env
---

## Tech Stack

- Backend: Flask, SQLAlchemy, Flask-Login
- Database: MySQL
- Frontend: HTML, CSS, Bootstrap 5, Jinja2
- OCR: Tesseract, Pillow
- APIs: restcountries.com, exchangerate-api.com