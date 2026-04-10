# India Post Python ML Service

## What this does
Receives village demographic data from Spring Boot.
Scores all 7 financial schemes. Returns ranked list.

## Setup (first time only)

1. Create virtual environment:
   python -m venv venv

2. Activate virtual environment:
   Windows:    venv\Scripts\activate
   Mac/Linux:  source venv/bin/activate

3. Install libraries:
   pip install -r requirements.txt

## Run

Make sure virtual environment is activated, then:
   python run.py

Service starts at: http://localhost:8000
API docs at:       http://localhost:8000/docs

## Test manually
Open http://localhost:8000/docs in browser.
Click POST /recommend > Try it out > paste example body > Execute.

## Endpoints
GET  /health    - Check if service is running
POST /recommend - Score schemes for a village
