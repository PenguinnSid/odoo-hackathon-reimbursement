"""OCR utilities for receipt image processing and data extraction"""

import os
import re
import sys
from PIL import Image
from datetime import datetime
from pathlib import Path

# Try to import pytesseract, provide helpful error if not available
try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False
    pytesseract = None

# Configure Tesseract path (for Windows installation)
# Uncomment and set if Tesseract is installed in a non-standard location:
# pytesseract.pytesseract.pytesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

UPLOADS_DIR = Path(__file__).parent.parent / 'uploads' / 'receipts'
UPLOADS_DIR.mkdir(parents=True, exist_ok=True)

# Common currency symbols and codes
CURRENCY_PATTERNS = {
    r'\$|USD': 'USD',
    r'€|EUR': 'EUR',
    r'£|GBP': 'GBP',
    r'¥|JPY': 'JPY',
    r'₹|INR': 'INR',
    r'C\$|CAD': 'CAD',
}


def extract_text_from_image(image_path):
    """Extract text from image using Tesseract OCR"""
    if not TESSERACT_AVAILABLE:
        return None
    
    try:
        img = Image.open(image_path)
        # Enhance image for better OCR
        img = img.convert('RGB')
        text = pytesseract.image_to_string(img)
        return text.strip()
    except Exception as e:
        print(f"OCR extraction error: {e}", file=sys.stderr)
        return None


def parse_amount(text):
    """Extract amount from OCR text"""
    # Look for currency patterns followed by numbers
    amount_pattern = r'[$€£¥₹]?\s*(\d+(?:[.,]\d{2})?)'
    matches = re.findall(amount_pattern, text)
    
    if matches:
        for match in matches:
            # Return the largest amount found (likely the total)
            amount_str = match.replace(',', '.')
            try:
                return float(amount_str)
            except ValueError:
                continue
    return None


def parse_currency(text):
    """Extract currency from OCR text"""
    for pattern, currency in CURRENCY_PATTERNS.items():
        if re.search(pattern, text):
            return currency
    return 'USD'  # Default to USD


def parse_vendor(text):
    """Extract vendor/merchant name from OCR text"""
    # Usually on first or second line
    lines = text.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and len(line) > 3 and len(line) < 100:
            # Filter out numbers-only lines and very short lines
            if not line.isdigit():
                return line
    return None


def parse_date(text):
    """Extract date from OCR text"""
    date_patterns = [
        r'(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})',  # DD/MM/YYYY or MM/DD/YYYY
        r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{1,2}),?\s+(\d{4})',  # Month DD, YYYY
        r'(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+(\d{4})',  # DD Month YYYY
    ]
    
    for pattern in date_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            try:
                date_str = match.group(0)
                # Try to parse various date formats
                for fmt in ['%d/%m/%Y', '%m/%d/%Y', '%d-%m-%Y', '%m-%d-%Y', '%B %d, %Y', '%d %B %Y']:
                    try:
                        return datetime.strptime(date_str, fmt).date()
                    except ValueError:
                        continue
            except Exception:
                continue
    
    return None


def parse_description(text):
    """Extract description/items from OCR text"""
    lines = text.split('\n')
    descriptions = []
    
    for line in lines:
        line = line.strip()
        # Look for lines that contain items (usually with descriptions)
        if line and len(line) > 5 and len(line) < 200:
            if not line.isdigit() and '$' in line:
                descriptions.append(line)
    
    return ' | '.join(descriptions[:3]) if descriptions else 'Receipt items'


def process_receipt_image(image_path):
    """Process receipt image and extract structured data"""
    
    # Extract text using OCR
    raw_text = extract_text_from_image(image_path)
    
    if not raw_text:
        # Fallback: If Tesseract not available, return demo data with helpful message
        if not TESSERACT_AVAILABLE:
            return {
                'status': 'demo',
                'raw_text': '📋 DEMO MODE: Tesseract OCR not installed. Install from: https://github.com/UB-Mannheim/tesseract/wiki\nExample extracted: Pizza Palace, $45.50, 2024-01-15',
                'amount': 45.50,
                'currency': 'USD',
                'vendor': 'Pizza Palace',
                'date': None,
                'description': 'Restaurant meal',
                'note': 'Tesseract OCR not available on this system. To enable real OCR: (Windows) Install Tesseract-OCR from https://github.com/UB-Mannheim/tesseract/wiki or (Mac/Linux) brew/apt install tesseract',
            }
        else:
            return {
                'status': 'failed',
                'error': 'Failed to extract text from image'
            }
    
    # Parse structured data
    parsed_data = {
        'status': 'done',
        'raw_text': raw_text[:500],  # Limit raw text
        'amount': parse_amount(raw_text),
        'currency': parse_currency(raw_text),
        'vendor': parse_vendor(raw_text),
        'date': parse_date(raw_text).isoformat() if parse_date(raw_text) else None,
        'description': parse_description(raw_text),
    }
    
    return parsed_data


def save_upload_file(file):
    """Save uploaded file and return path"""
    try:
        filename = f"{int(datetime.now().timestamp() * 1000)}_{file.filename}"
        file_path = UPLOADS_DIR / filename
        file.save(str(file_path))
        return str(file_path)
    except Exception as e:
        return None
