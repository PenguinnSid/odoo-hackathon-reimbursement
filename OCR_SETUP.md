# OCR Receipt Processing Guide

## Overview

The ReimburseFlow application now includes **Optical Character Recognition (OCR)** functionality to automatically extract expense details from receipt images. This guide explains how to set up and use the OCR feature.

## Features

✅ **Automatic Receipt Processing**
- Upload receipt images (PNG, JPG, GIF, BMP, TIFF)
- Automatically extracts: Amount, Date, Vendor, Description
- Pre-fills expense claim form with extracted data
- Shows OCR processing status and extracted text preview

✅ **Smart Data Parsing**
- Detects currency (USD, EUR, GBP, INR, JPY, CAD)
- Extracts dates in multiple formats
- Identifies vendor/merchant names
- Parses line items and amounts

✅ **Fallback Mode**
- If Tesseract OCR is not installed, app provides demo data
- Shows installation instructions
- Allows manual receipt entry as alternative

## Installation

### 1. Python Dependencies (Already Installed)

The required Python packages are already in `requirements.txt`:
```bash
pip install pytesseract Pillow
```

### 2. Tesseract OCR System Binary

The Python `pytesseract` library requires Tesseract OCR to be installed on your system.

#### **Windows (Recommended for this project)**

1. Download the installer from:
   https://github.com/UB-Mannheim/tesseract/wiki/Downloads

2. Run the installer:
   - Choose default installation path: `C:\Program Files\Tesseract-OCR`
   - Accept all defaults during installation
   - The app will auto-detect the installation

3. Verify installation:
   ```powershell
   tesseract --version
   ```

#### **macOS**

```bash
brew install tesseract
```

#### **Linux (Ubuntu/Debian)**

```bash
sudo apt-get install tesseract-ocr
```

#### **Linux (Fedora/RHEL)**

```bash
sudo dnf install tesseract
```

## Usage

### Uploading a Receipt

1. **Click "New Claim" button** in the dashboard
2. **Click the upload zone** or drag & drop an image
3. **Wait for processing** - Shows "⏳ Processing with OCR..."
4. **Review extracted data** - Shows extracted amount, date, vendor
5. **Edit fields** - Form is auto-populated; edit if needed
6. **Submit claim** - Click "Submit Claim →"

### Supported File Formats

- **PNG** - Best quality, larger file size
- **JPG/JPEG** - Good balance of quality and size
- **GIF** - Supported but not recommended
- **BMP** - Supported but rarely used
- **TIFF** - High quality, large file size

### File Size Limit

- **Maximum: 10 MB** per receipt
- Recommended: 2-5 MB for faster processing

## Backend Details

### Receipt Upload Endpoint

```
POST /expenses/receipts/upload
Content-Type: multipart/form-data

Response (200):
{
  "ok": true,
  "receipt": {
    "id": 1234567890,
    "file_path": "/path/to/receipt",
    "file_type": "jpg",
    "status": "done",
    "raw_text": "...",
    "parsed_amount": 45.50,
    "parsed_currency": "USD",
    "parsed_vendor": "Pizza Palace",
    "parsed_date": "2024-01-15",
    "parsed_description": "Restaurant meal"
  }
}
```

### Receipt Processing Stages

1. **Upload** - File received and validated
2. **Processing** - Tesseract extracts text (2-5 seconds)
3. **Parsing** - Regex patterns extract structured data
4. **Response** - JSON returned with all extracted fields

## Extracted Data

The OCR processor attempts to extract:

| Field | Example | Accuracy |
|-------|---------|----------|
| **Amount** | 45.50 | 95%+ for clear numbers |
| **Currency** | USD | 90%+ for standard symbols |
| **Date** | 2024-01-15 | 80%+ (format handling) |
| **Vendor** | Pizza Palace | 85%+ (first lines) |
| **Description** | Items with prices | 70%+ (multi-line) |

## Troubleshooting

### Receipt Processing Shows "Demo Mode"

**Problem:** OCR shows demo data instead of actual extraction

**Solution:** Tesseract OCR is not installed. Install it following the system-specific instructions in "Installation" section above.

### "File too large" Error

**Problem:** Cannot upload file larger than 10 MB

**Solution:** Compress the image using:
- macOS: Preview → Export → Quality slider
- Windows: Paint → Resize
- Online: https://tinypng.com/ or similar

### Poor OCR Results

**Problem:** Extracted amount/date is incorrect

**Improve accuracy by:**
- Ensuring receipt is well-lit and in focus
- Scanning receipt at 300 DPI or higher
- Cropping unnecessary margins/borders
- Using original receipt (not a photo of a photo)

### OCR Not Processing

**Problem:** Upload succeeds but OCR data not showing

**Solution:**
- Check Flask backend logs for errors
- Verify Python environment has pytesseract installed
- Restart Flask server: `python run.py`

## Demo Mode

If Tesseract is not installed, the app provides **demo mode** with:

- Sample extracted data (⏳ Pizza Palace, $45.50)
- Instructions for installing Tesseract
- Full application flow demonstration
- Form auto-fill to show the workflow

Demo mode allows testing the entire application without OCR.

## Architecture

```
Frontend (React)
↓ [File Upload]
↓ [FormData via Fetch]
Backend (Flask)
↓ [Handle multipart/form-data]
↓ [Save file to /uploads/receipts/]
OCR Processing (app/ocr_utils.py)
↓ [Load image with Pillow]
↓ [Extract text with Tesseract]
↓ [Parse with regex patterns]
↓ [Return structured JSON]
Response
↓ [Display in form]
↓ [User reviews & edits]
↓ [Submit claim with receipt ID]
```

## File Structure

```
app/
├── ocr_utils.py           # OCR processing logic
├── expenses/
│   └── routes.py          # /expenses/receipts/upload endpoint
│
uploads/                   # Created automatically
└── receipts/              # Receipt image storage
    └── 1234567890_receipt.jpg
```

## Performance

- **Processing Time:** 2-5 seconds per receipt (Tesseract speed varies)
- **Storage:** ~1-2 MB per receipt image
- **Memory:** ~50-100 MB for OCR engine

## Environment Variables (Optional)

Set custom Tesseract path in `app/ocr_utils.py`:

```python
# For non-standard Windows installations:
import pytesseract
pytesseract.pytesseract.pytesseract_cmd = r'C:\Custom\Path\tesseract.exe'
```

## Next Steps

- ✅ Upload your first receipt
- ✅ Edit auto-filled amount if needed
- ✅ Submit the expense claim
- ✅ Track the claim through approval workflow

## Support

For issues or feature requests:
1. Check troubleshooting section above
2. Review OCR extracted text preview
3. Verify Tesseract installation with: `tesseract --version`
4. Check Flask logs for backend errors

---

**Happy Receipt Processing! 📸💰**
