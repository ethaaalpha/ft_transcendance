FROM python:3.12.1-alpine

RUN apk add --no-cache build-base libffi-dev bash gcompat git


ADD requirements.txt requirements.txt
RUN pip install -r requirements.txt
ADD runner.sh /script/

WORKDIR /workdir/back

CMD ["sh", "/script/runner.sh"]