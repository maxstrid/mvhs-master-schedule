FROM python:3.11.9-alpine

WORKDIR /flask

COPY flask/requirements.txt flask/requirements.txt
RUN pip3 install -r flask/requirements.txt

COPY . .

EXPOSE 5000

CMD [ "python3", "-m" , "flask", "--app", "flask/server", "run", "--host=0.0.0.0"]
