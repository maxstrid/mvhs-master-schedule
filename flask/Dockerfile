FROM python:3.11.9-alpine

WORKDIR /flask

RUN pip3 install numpy yapf flask pandas pandas-stubs types-colorama

COPY . .

ENTRYPOINT ["python3"]
CMD ["server.py"]
