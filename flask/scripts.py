#!/usr/bin/env python3

import subprocess

project_id="mvhs-master-schedule"
service_name="flask"
region="us-west1"

def gcloud_build():
    print(f"Running: gcloud builds submit --tag gcr.io/{project_id}/{service_name}")
    subprocess.run(["gcloud", "builds", "submit", "--tag", f"gcr.io/{project_id}/{service_name}"])
    print("Complete.")

def gcloud_deploy():
    print(f"Running: gcloud run deploy flask --region {region} --image gcr.io/{project_id}/{service_name}")
    subprocess.run(["gcloud", "run", "deploy", "flask", "--region", region, "--image", f"gcr.io/{project_id}/{service_name}"])
    print("Complete.")
