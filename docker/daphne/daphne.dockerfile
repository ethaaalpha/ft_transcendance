FROM python:3.12.1-alpine

RUN apk add --no-cache build-base libffi-dev bash git gcompat


ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt
ADD runner.sh /script/
ADD solc-installer.py /script/

WORKDIR /workdir/pong_back

CMD ["sh", "/script/runner.sh"]