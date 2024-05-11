# Flask backend

## Info

The backend imports two files in conflict and builds a schedule based off of the conflict matrix in the conflict folder.
It then exposes a few api endpoints to handle sending this data to the frontend.

## Development

We use poetry for the backend, if you have poetry installed you can get the dependencies with:

```bash
poetry install
```

Then you can run the app using `poetry run flask --app server run`

## Deploying

The backend is hosted on a google cloud microservice, and then accessed by firebase. To build the gcloud service use:

```bash
poetry run gbuild
```

This assumes you have gcloud and are authenticated for the `mvhs-master-schedule` project. Then to deploy use:

```bash
poetry run gdeploy
```

This should give you the link which the backend is hosted on, which you can use to test. Furthermore you can make sure the image works properly with:

```bash
poetry run gdev
```

This starts a development server using the gcloud cli, letting you make sure the package docker image works properly.
