FROM python:3.12.1-alpine

RUN apk add build-base libffi-dev
RUN apk add bash
ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt

ADD runner.sh .

WORKDIR /workdir/pong_back

CMD ["sh", "/runner.sh"]