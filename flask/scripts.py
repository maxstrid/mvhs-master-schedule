#!/usr/bin/env python3

import subprocess

project_id = "mvhs-master-schedule"
service_name = "flask"
region = "us-west1"


# Builds the docker image for gcloud and uploasds it to a gcloud artifact.
def gcloud_build():
    print(
        f"Running: gcloud builds submit --tag gcr.io/{project_id}/{service_name}"
    )
    subprocess.run([
        "gcloud", "builds", "submit", "--tag",
        f"gcr.io/{project_id}/{service_name}"
    ])
    print("Complete.")


# Takes the image and deploys it into the us-west1 region.
def gcloud_deploy():
    print(
        f"Running: gcloud run deploy flask --region {region} --image gcr.io/{project_id}/{service_name}"
    )
    subprocess.run([
        "gcloud", "run", "deploy", "flask", "--region", region, "--image",
        f"gcr.io/{project_id}/{service_name}"
    ])
    print("Complete.")


# Runs a development server to test the gcloud image.
def gcloud_dev():
    print(f"Running: gcloud beta code dev")
    subprocess.run(["gcloud", "beta", "code", "dev"])
    print("Complete.")
