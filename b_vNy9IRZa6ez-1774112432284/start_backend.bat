cd /d E:\Eureka\backend
python -m venv venv
call venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8000
