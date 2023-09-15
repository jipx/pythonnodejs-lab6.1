'''
	You must replace <bucket-name> with your actual bucket name
'''
import boto3
import json

S3API = boto3.client("s3", region_name="us-east-1")
bucket_name = "c81790a1735448l4736822t1w177864690919-s3bucket-ui1pjtdqu1gy"

policy_file = open("/home/ec2-user/environment/pythonnodejs-lab6.1/resources/website_security_policy.json", "r")


S3API.put_bucket_policy(
    Bucket = bucket_name,
    Policy = policy_file.read()
)
print ("DONE")
