FROM python:3.12.1-alpine

RUN apk add build-base libffi-dev
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt

WORKDIR /workdir/pong_back

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]