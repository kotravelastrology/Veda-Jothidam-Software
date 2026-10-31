# Veda Jothidam - Birth Chart Management Beta Test Instructions

## Overview
Thank you for participating in the beta testing of the Veda Jothidam Vedic Astrology SaaS application! This document provides step-by-step instructions for testing the improved **Birth Chart Management** form, which includes significant UI/UX enhancements.

**Testing Duration**: Approximately 15-20 minutes per tester  
**Test Environment**: Fresh Docker deployment with PostgreSQL, Redis, and Flask backend  
**Target Testers**: 4-5 external users with varying technical backgrounds  

---

## Prerequisites

### System Requirements
- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Internet Connection**: Stable connection required
- **Port Access**: Ensure ports 3000 (frontend) and 5000 (backend) are accessible

### Access Information
- **Application URL**: `http://localhost:3000` (provided by development team)
- **Test Account**: Credentials will be provided separately
  - Email: `test-user@vedajothidam.com`
  - Password: `[provided via secure channel]`

> **Note**: If testing locally, ensure Docker services are running:
> ```bash
> cd D:\KotravelAstrology\Veda-Jothidam-Software
> docker-compose up -d
> ```

---

## Getting Started

### Step 1: Access the Application
1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the Veda Jothidam home page

### Step 2: Login
1. Click the "Login" or "Sign In" button
2. Enter your test account credentials:
   - Email: `test-user@vedajothidam.com`
   - Password: `[as provided]`
3. Click "Login"
4. You should be redirected to the dashboard

### Step 3: Navigate to Birth Chart Management
1. Look for the "Birth Chart Management" section in the main navigation or dashboard
2. Click on "Create New Chart" or similar option
3. You should see the Birth Chart Management form

---

## Form Testing Checklist

### Section 1: Chart Name
**Purpose**: Identify and organize your birth charts

- [ ] **Test**: Enter a chart name (e.g., "My First Jathakam")
  - **Expected**: Text input accepts 1-100 characters
  - **Expected**: No special characters causing issues
  - **Expected**: Form remembers the name after form interactions

### Section 2: Birth Date
**Purpose**: Specify the birth date in DD-MM-YYYY format (side-by-side layout improvement)

#### Sub-field: Day
- [ ] **Test**: Enter day value (01-31)
  - **Expected**: Field accepts two-digit day values
  - **Expected**: Invalid values (0, 32+, letters) are either rejected or auto-corrected
  - **Expected**: Field has placeholder text "DD"

#### Sub-field: Month
- [ ] **Test**: Enter month value (01-12)
  - **Expected**: Field accepts two-digit month values
  - **Expected**: Invalid values (0, 13+, letters) are either rejected or auto-corrected
  - **Expected**: Field has placeholder text "MM"

#### Sub-field: Year
- [ ] **Test**: Enter year value (1800-2100)
  - **Expected**: Field accepts four-digit year values
  - **Expected**: Years outside valid range show an error message
  - **Expected**: Field has placeholder text "YYYY"

#### Layout Check:
- [ ] **Test**: Date fields are displayed side-by-side horizontally
  - **Expected**: All three fields (Day, Month, Year) are on the same line
  - **Expected**: Fields are properly spaced and aligned
  - **Expected**: Layout remains responsive on mobile devices

### Section 3: Birth Time
**Purpose**: Specify the birth time in HH:MM:SS format (side-by-side layout improvement)

#### Sub-field: Hour
- [ ] **Test**: Enter hour value (00-23)
  - **Expected**: Field accepts two-digit hour values (00-23)
  - **Expected**: Invalid values (24+, letters) are rejected or auto-corrected
  - **Expected**: Field has placeholder text "HH"

#### Sub-field: Minute
- [ ] **Test**: Enter minute value (00-59)
  - **Expected**: Field accepts two-digit minute values
  - **Expected**: Invalid values (60+, letters) are rejected or auto-corrected
  - **Expected**: Field has placeholder text "MM"

#### Sub-field: Second
- [ ] **Test**: Enter second value (00-59)
  - **Expected**: Field accepts two-digit second values
  - **Expected**: Invalid values (60+, letters) are rejected or auto-corrected
  - **Expected**: Field has placeholder text "SS"

#### Layout Check:
- [ ] **Test**: Time fields are displayed side-by-side horizontally
  - **Expected**: All three fields (Hour, Minute, Second) are on the same line
  - **Expected**: Fields are properly spaced and aligned
  - **Expected**: Layout remains responsive on mobile devices

### Section 4: Birth Place (Location Autocomplete)
**Purpose**: Select birth location with automatic coordinate and timezone detection

- [ ] **Test**: Type a city name (minimum 3+ letters)
  - **Expected**: Autocomplete dropdown appears below the input field
  - **Expected**: Dropdown shows matching city suggestions
  - **Example Cities**: Mumbai, Delhi, Bangalore, Chennai, Kolkata

- [ ] **Test**: Click on a suggested city
  - **Expected**: City name is filled in the Birth Place field
  - **Expected**: Latitude and Longitude fields are automatically populated
  - **Expected**: Timezone field is automatically set to the location's timezone

#### Test with "Mumbai":
- [ ] Birth Place: "Mumbai"
- [ ] Latitude should be: ~19.0760
- [ ] Longitude should be: ~72.8777
- [ ] Timezone should be: "Asia/Kolkata"

#### Test with "Delhi":
- [ ] Birth Place: "Delhi"
- [ ] Latitude should be: ~28.7041
- [ ] Longitude should be: ~77.1025
- [ ] Timezone should be: "Asia/Kolkata"

#### Test with "Bangalore":
- [ ] Birth Place: "Bangalore"
- [ ] Latitude should be: ~12.9716
- [ ] Longitude should be: ~77.5946
- [ ] Timezone should be: "Asia/Kolkata"

### Section 5: Geographic Coordinates
**Purpose**: Display auto-populated coordinates from location selection

- [ ] **Test**: Verify Latitude field is read-only
  - **Expected**: Field shows "readonly" appearance (grayed out)
  - **Expected**: Cannot manually edit after location selection

- [ ] **Test**: Verify Longitude field is read-only
  - **Expected**: Field shows "readonly" appearance (grayed out)
  - **Expected**: Cannot manually edit after location selection

- [ ] **Test**: Values are auto-populated
  - **Expected**: Values appear after location selection
  - **Expected**: Values match the selected city's actual coordinates
  - **Expected**: Values have correct decimal precision (4-6 decimal places)

### Section 6: Timezone (Auto-detected)
**Purpose**: Display timezone automatically based on location

- [ ] **Test**: Verify timezone field is read-only
  - **Expected**: Field shows "readonly" appearance (grayed out)
  - **Expected**: Default value is "Asia/Kolkata"

- [ ] **Test**: Timezone auto-updates with location change
  - **Expected**: When changing location, timezone updates automatically
  - **Expected**: Timezone matches the selected location's timezone
  - **Example**: All Indian cities should show "Asia/Kolkata"

---

## Form Submission Testing

### Create Chart Button
- [ ] **Test**: Enter all required information as per above checklist
- [ ] **Test**: Click the "Create Chart" button
  - **Expected**: Form is validated
  - **Expected**: If valid, success message appears (e.g., "Chart created successfully")
  - **Expected**: API response shows the created chart with all details
  - **Expected**: Response includes:
    - Chart ID (unique identifier)
    - Chart name
    - Birth date (YYYY-MM-DD format)
    - Birth time (HH:MM:SS format)
    - Birth location
    - Coordinates (latitude, longitude)
    - Timezone
    - Created timestamp

### Validation Testing
- [ ] **Test**: Submit form with empty Chart Name
  - **Expected**: Error message: "Chart name is required"
  - **Expected**: Form is not submitted

- [ ] **Test**: Submit form with invalid birth date (e.g., 32-13-2024)
  - **Expected**: Error message about invalid date
  - **Expected**: Form is not submitted

- [ ] **Test**: Submit form with invalid time (e.g., 25:61:90)
  - **Expected**: Error message about invalid time
  - **Expected**: Form is not submitted

- [ ] **Test**: Submit form with missing coordinates
  - **Expected**: Error message prompting to select a location
  - **Expected**: Form is not submitted

---

## List My Charts Testing

### Viewing Chart List
1. After creating a chart, locate the "List My Charts" button
2. Click the button
   - **Expected**: A list of your charts is displayed
   - **Expected**: Your newly created chart appears in the list
   - **Expected**: Each chart shows:
     - Chart name
     - Birth date
     - Birth location
     - Creation date

### Multiple Charts
- [ ] **Test**: Create 2-3 additional charts with different data
- [ ] **Test**: Click "List My Charts" again
  - **Expected**: All created charts are listed
  - **Expected**: Charts are sorted (verify order - newest first or oldest first)
  - **Expected**: No duplicates appear

---

## UI/UX Improvements Validation

### Layout Responsiveness
- [ ] **Test**: Open form on desktop browser (1920x1080)
  - **Expected**: All form fields are properly aligned
  - **Expected**: No horizontal scrolling required
  - **Expected**: Buttons are easily clickable

- [ ] **Test**: Resize browser to tablet size (768x1024)
  - **Expected**: Form adapts to narrower width
  - **Expected**: Fields stack appropriately
  - **Expected**: All content remains readable

- [ ] **Test**: Resize browser to mobile size (375x812)
  - **Expected**: Form is fully responsive
  - **Expected**: Date/Time fields adapt to mobile layout
  - **Expected**: Buttons remain accessible
  - **Expected**: No horizontal scrolling

### Visual Design
- [ ] **Test**: Form colors and styling
  - **Expected**: Form has a professional appearance
  - **Expected**: Input fields are clearly visible
  - **Expected**: Buttons have good contrast and are easy to read
  - **Expected**: Error messages are clearly visible

- [ ] **Test**: Field labels and descriptions
  - **Expected**: All fields have clear labels
  - **Expected**: Placeholder text guides data entry
  - **Expected**: Read-only fields are visually distinguished

### Accessibility
- [ ] **Test**: Tab through form fields using keyboard
  - **Expected**: Tab order is logical (top to bottom, left to right)
  - **Expected**: All interactive elements are accessible via keyboard
  - **Expected**: Focus states are visible

- [ ] **Test**: Font sizes and colors
  - **Expected**: Text is readable without zooming
  - **Expected**: Sufficient color contrast for accessibility
  - **Expected**: Links and buttons are clearly distinguishable

---

## Performance Testing

- [ ] **Test**: Form load time
  - **Expected**: Form loads within 2-3 seconds
  - **Expected**: No lag when typing in fields

- [ ] **Test**: Location autocomplete response
  - **Expected**: Suggestions appear within 500ms of typing
  - **Expected**: No delays when selecting a location

- [ ] **Test**: Chart creation response time
  - **Expected**: Success response appears within 2-3 seconds
  - **Expected**: No timeout errors

- [ ] **Test**: Chart list loading
  - **Expected**: List appears within 1-2 seconds
  - **Expected**: Smooth scrolling if multiple charts

---

## Issue Reporting

### How to Report Issues
If you encounter any problems during testing, please document them following this format:

**Issue Template**:
```
Title: [Brief description of the issue]
Severity: Critical / High / Medium / Low
Device: [Desktop/Tablet/Mobile]
Browser: [Chrome/Firefox/Safari/Edge + Version]
OS: [Windows/Mac/Linux + Version]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Behavior:
[What should happen]

Actual Behavior:
[What actually happened]

Screenshots/Videos:
[If applicable, attach screenshots or video recordings]

Additional Notes:
[Any additional context]
```

### Where to Report Issues
- Create an issue in the project's issue tracking system (GitHub/Linear)
- Or send an email to: `bugs@vedajothidam.com`

---

## Test Results Summary

Please complete the following summary after testing:

### Overall Impression
- [ ] Form is user-friendly
- [ ] Form is visually appealing
- [ ] Form is responsive on all devices
- [ ] All features work as expected

### Feature Ratings (1-5 stars)
- **Date/Time Side-by-Side Layout**: ⭐⭐⭐⭐⭐
- **Location Autocomplete**: ⭐⭐⭐⭐⭐
- **Automatic Coordinate Population**: ⭐⭐⭐⭐⭐
- **Form Validation**: ⭐⭐⭐⭐⭐
- **Overall UI/UX**: ⭐⭐⭐⭐⭐

### Open-Ended Feedback
- What did you like most about the form?
- What could be improved?
- Did you encounter any confusing elements?
- Would you recommend this to others?

---

## Support

### FAQ

**Q: I'm getting a "CORS Policy" error**  
A: This means the frontend cannot communicate with the backend. Ensure both services are running on the correct ports (3000 and 5000).

**Q: The location autocomplete isn't showing suggestions**  
A: Try typing at least 3 characters. If the issue persists, check your browser's console (F12 > Console tab) for error messages.

**Q: My chart isn't appearing in "List My Charts"**  
A: Ensure you created the chart successfully (check the success response). Also verify you're logged in with the same account used to create the chart.

**Q: Date/Time fields aren't side-by-side on mobile**  
A: This is expected behavior - on mobile devices, fields may stack vertically for better usability. Try rotating your device to landscape mode.

### Technical Support Contact
- **Email**: `support@vedajothidam.com`
- **Slack Channel**: `#beta-testing` (if available)

---

## Thank You!

Your feedback is invaluable for improving the Veda Jothidam application. We appreciate your time and effort in testing these features. Together, we're building a world-class Vedic Astrology platform!

**Happy Testing! 🚀**

---

## Appendix: Test Data

### Sample Test Cases

#### Test Case 1: Create Chart for Mumbai Birth
- **Chart Name**: "Mumbai Birth Chart"
- **Birth Date**: 18-04-1974
- **Birth Time**: 07:25:00
- **Birth Place**: Mumbai
- **Expected Coordinates**: Lat 19.0760, Lon 72.8777
- **Expected Timezone**: Asia/Kolkata

#### Test Case 2: Create Chart for Delhi Birth
- **Chart Name**: "Delhi Birth Chart"
- **Birth Date**: 15-08-1947
- **Birth Time**: 14:30:00
- **Birth Place**: Delhi
- **Expected Coordinates**: Lat 28.7041, Lon 77.1025
- **Expected Timezone**: Asia/Kolkata

#### Test Case 3: Create Chart for Bangalore Birth
- **Chart Name**: "Bangalore Birth Chart"
- **Birth Date**: 01-01-2000
- **Birth Time**: 12:00:00
- **Birth Place**: Bangalore
- **Expected Coordinates**: Lat 12.9716, Lon 77.5946
- **Expected Timezone**: Asia/Kolkata

---

**Document Version**: 1.0  
**Last Updated**: 2026-09-17  
**Testing Period**: September 17-24, 2026
