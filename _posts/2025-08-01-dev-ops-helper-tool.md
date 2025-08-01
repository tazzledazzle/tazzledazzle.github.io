---
title: DevOps Helper Tool
date: "2025-08-01 14:17:22"
layout: post
---


----

# DevOps Helper tool

This is a blueprint for designing and implementing a “dev-ops helper” Python library that wraps common AWS, GCP, and Kubernetes SDK calls, complete with authentication patterns.

## **1. Design Goals**

1. **Uniform API**

The tool should expose simple, consistent methods (e.g. create_bucket(), list_clusters()) regardless of provider.

2. **Pluggable Backends**

Selection of AWS, GCP, or Kubernetes at runtime via configuration or environment.
    
3. **Authentication Agnostic**
    
Automatically retrieve credentials from environment variables, configuration files, or from in-cluster metadata. The less hand-holding the better is a soft goal for this tool. 
    
4. **Resilience & Observability**
    
Automatic default retries, timeouts, logging, and error handling.
    
5. **Minimal Dependencies**
    
Only include each cloud’s official SDK and common utilities.
    
----

## **2. Project Layout**

```
devops_helper/
├── devops_helper/
│   ├── __init__.py
│   ├── aws_client.py
│   ├── gcp_client.py
│   ├── k8s_client.py
│   ├── config.py
│   └── utils.py
├── tests/
│   ├── test_aws.py
│   ├── test_gcp.py
│   └── test_k8s.py
├── setup.py
└── README.md
```

- **config.py**: Load provider choice, regions, timeouts.
- **utils.py**: Common retry decorators, logging setup.
- **_client.py**: One module per provider wrapping that SDK.

---

## **3. Authentication Patterns**
AWS (boto3), GCP (google-cloud-python), Kubernetes (kubernetes-client)

### **AWS (boto3)**

```python
import boto3
from botocore.config import Config

# Credentials resolution order:
# 1. AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY
# 2. ~/.aws/credentials
# 3. EC2 Instance / ECS Task Role

def aws_session(region: str = None):
    return boto3.Session(region_name=region)

def s3_client(region: str = None):
    sess = aws_session(region)
    return sess.client('s3', config=Config(retries={'max_attempts': 5}))
```

### **GCP (google-cloud-python)**

```python
from google.cloud import storage
from google.auth import default

# Credentials resolution:
# 1. GOOGLE_APPLICATION_CREDENTIALS JSON file
# 2. Compute Engine / GKE metadata server

def gcp_storage_client():
    # ADC: picks up service-account or metadata credentials
    creds, project = default()
    return storage.Client(project=project, credentials=creds)
```

### **Kubernetes (kubernetes-client)**

```python
from kubernetes import client, config

def k8s_api():
    try:
        config.load_incluster_config()
    except config.ConfigException:
        config.load_kube_config()  # ~/.kube/config
    return client.CoreV1Api()
```

---

## **4. Wrapping Common Calls**

### **AWS Wrapper (aws_client.py)**

```python
import logging
from .utils import retry
from .config import AWS_REGION

class AWSHelper:
    def __init__(self, region: str = AWS_REGION):
        self.s3 = s3_client(region)
        self.ec2 = aws_session(region).client('ec2')

    @retry(on_exceptions=(Exception,), attempts=3, backoff=2)
    def create_bucket(self, name: str):
        logging.info(f"Creating S3 bucket {name}")
        return self.s3.create_bucket(Bucket=name)

    def list_instances(self):
        resp = self.ec2.describe_instances()
        instances = []
        for r in resp['Reservations']:
            instances.extend(r['Instances'])
        return instances
```

### **GCP Wrapper (gcp_client.py)**

```python
import logging
from .utils import retry

class GCPHelper:
    def __init__(self):
        self.storage = gcp_storage_client()

    @retry(on_exceptions=(Exception,), attempts=3, backoff=1)
    def create_bucket(self, name: str):
        logging.info(f"Creating GCS bucket {name}")
        bucket = self.storage.bucket(name)
        return bucket.create()

    def list_buckets(self):
        return [b.name for b in self.storage.list_buckets()]
```

### **Kubernetes Wrapper (k8s_client.py)**

```python
import logging
from .utils import retry

class K8sHelper:
    def __init__(self):
        self.api = k8s_api()

    @retry(on_exceptions=(Exception,), attempts=3, backoff=1)
    def list_pods(self, namespace: str = 'default'):
        logging.info(f"Listing pods in {namespace}")
        pods = self.api.list_namespaced_pod(namespace)
        return [p.metadata.name for p in pods.items]

    def delete_pod(self, name: str, namespace: str = 'default'):
        return self.api.delete_namespaced_pod(name, namespace)
```

---

## **5. Utility Components**

**utils.py** – simple retry decorator and structured logging:

```pyhton
import time, logging
from functools import wraps

def retry(on_exceptions, attempts=3, backoff=1):
    def deco(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            for i in range(attempts):
                try:
                    return fn(*args, **kwargs)
                except on_exceptions as e:
                    logging.warning(f"Attempt {i+1}/{attempts} failed: {e}")
                    time.sleep(backoff * (2**i))
            raise
        return wrapper
    return deco
```

**config.py** – environment-driven settings:

```python
import os

AWS_REGION = os.getenv('AWS_REGION', 'us-west-2')
```

---

## **6. Testing & Packaging**

1. **Tests**: mock SDK clients with moto (AWS), pytest-mock for GCP, and kubernetes-client’s fake client.

   ```python
     import boto3
    from moto import mock_aws # Or specific service decorators like mock_s3, mock_sqs etc.

   @mock_s3
   def test_s3_upload():
        s3_client = boto3.client("s3")
        # ... test S3 operations ...
   ```

### GCP

  ```python

  from google.cloud import storage
  from pytest_mock import MockerFixture
  
  def test_upload_to_gcs(mocker: MockerFixture):
      # Mock the storage client and its methods
      mock_blob = mocker.MagicMock()
      mock_bucket = mocker.MagicMock()
      mock_bucket.blob.return_value = mock_blob
      mocker.patch.object(storage.Client, 'bucket', return_value=mock_bucket)
  
      # Call the function that interacts with GCS
      # ... your code that uses storage.Client().bucket('my-bucket').blob('my-file').upload_from_filename(...)
  
      # Assertions on the mocked objects
      mock_bucket.blob.assert_called_once_with('my-file')
      mock_blob.upload_from_filename.assert_called_once_with('local-file.txt')
  ```

### Kubernetes-Client

   ```python
   import unittest
   from unittest.mock import patch, Mock
   from kubernetes import client, config
    
   class MyKubernetesService:
       def get_pod_names_in_namespace(self, namespace):
           config.load_kube_config() # In a real scenario, this might be handled differently for testing
           v1 = client.CoreV1Api()
           pods = v1.list_namespaced_pod(namespace=namespace)
           return [pod.metadata.name for pod in pods.items]
    
   class TestMyKubernetesService(unittest.TestCase):
       @patch('kubernetes.client.CoreV1Api')
       @patch('kubernetes.config.load_kube_config')
       def test_get_pod_names_in_namespace(self, mock_load_kube_config, mock_core_v1_api):
           # Configure the mock CoreV1Api instance
           mock_v1_instance = Mock()
           mock_core_v1_api.return_value = mock_v1_instance
    
           # Create a mock V1PodList with some V1Pod objects
           mock_pod_list = Mock()
           mock_pod_list.items = [
               Mock(metadata=Mock(name="my-pod-1")),
               Mock(metadata=Mock(name="my-pod-2"))
           ]
           mock_v1_instance.list_namespaced_pod.return_value = mock_pod_list
    
           service = MyKubernetesService()
           pod_names = service.get_pod_names_in_namespace("test-namespace")
    
           self.assertEqual(pod_names, ["my-pod-1", "my-pod-2"])
           mock_v1_instance.list_namespaced_pod.assert_called_with(namespace="test-namespace")
           mock_load_kube_config.assert_called_once()

   if __name__ == '__main__':
       unittest.main()
   ```
3. **Packaging**:
  
  ```bash
  python setup.py sdist bdist_wheel
  pip install .
  ```

3. **Distribution**: publish to PyPI or an internal artifact repo.

---

## **7. Usage Example**

```python
from devops_helper.aws_client import AWSHelper
from devops_helper.gcp_client import GCPHelper
from devops_helper.k8s_client import K8sHelper

aws = AWSHelper();   aws.create_bucket("my-app-data")
gcp = GCPHelper();   print(gcp.list_buckets())
k8s = K8sHelper();   print(k8s.list_pods("production"))
```

---

By following this pattern you’ll have a single, consistent library that abstracts away cloud-specific boilerplate, handles authentication automatically, and provides retries and logging for every infrastructure call.
