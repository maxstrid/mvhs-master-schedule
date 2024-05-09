FROM python:3.11.9-alpine

WORKDIR /flask

RUN pip3 install poetry

COPY . .

RUN poetry install

ENTRYPOINT ["poetry"]
CMD ["run", "python3", "server.py"]
