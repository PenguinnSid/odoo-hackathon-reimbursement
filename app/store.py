from datetime import datetime


def now_str():
    return datetime.now().strftime('%d %b %Y, %I:%M %p')


STATE = {
    'claims': [
        {
            'id': 'CLM-001',
            'employeeId': 'employee-demo',
            'employee': 'Employee User',
            'title': 'Client lunch',
            'category': 'Meals',
            'amount': 3200,
            'date': '2026-03-20',
            'desc': 'Lunch with client to discuss quarterly roadmap.',
            'receipt': '',
            'status': 'paid',
            'comment': '',
            'timeline': [
                {'action': 'Submitted', 'by': 'Employee User', 'time': '20 Mar 2026, 10:20 AM'},
                {'action': 'Manager approved', 'by': 'Manager User (Manager)', 'time': '20 Mar 2026, 01:10 PM'},
                {
                    'action': 'Finance approved & payment processed',
                    'by': 'Finance User (Finance)',
                    'time': '21 Mar 2026, 09:05 AM',
                },
            ],
        },
        {
            'id': 'CLM-002',
            'employeeId': 'employee-demo',
            'employee': 'Employee User',
            'title': 'Travel - Pune office',
            'category': 'Travel',
            'amount': 8750,
            'date': '2026-03-24',
            'desc': 'Intercity travel for client onboarding workshop.',
            'receipt': '',
            'status': 'submitted',
            'comment': '',
            'timeline': [{'action': 'Submitted', 'by': 'Employee User', 'time': '24 Mar 2026, 04:40 PM'}],
        },
    ],
    'notifications': [
        {
            'id': 1,
            'title': 'Welcome to ReimburseFlow',
            'body': 'Your expense workspace is ready.',
            'time': now_str(),
            'unread': True,
            'forRole': ['employee', 'manager', 'finance', 'admin'],
        }
    ],
}


ROLE_PROFILES = {
    'employee': {'name': 'Employee User', 'email': 'employee@company.com', 'avatar': 'EU'},
    'manager': {'name': 'Manager User', 'email': 'manager@company.com', 'avatar': 'MU'},
    'finance': {'name': 'Finance User', 'email': 'finance@company.com', 'avatar': 'FU'},
    'admin': {'name': 'Admin User', 'email': 'admin@company.com', 'avatar': 'AU'},
}
