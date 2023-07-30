# Simple Pod Sync

Simple Pod Sync is an implementation of a limited subset of the gpodder.net api for syncing podcasts with apps like AntennaPod.

## Status

The app currently successfully synchronizes with antenna but may have bugs or not work correctly. Various security and user checks are also missing which may allow users to edit others podcasts and subscriptions.

## Works With

⚠️ Functional, expect bugs

| App        | Status |
| ---------- | ------ |
| AntennaPod | ⚠️     |

# Docker
To run the Simple Pod Sync server in a Docker container, you can set up Docker volumes to map the paths referenced in the environment variables.

Create Folders: Create two directories on your host system to store configuration and data:
bash
```bash
mkdir -p /path/to/pod-config
mkdir -p /path/to/pod-data

```
Run the Container: Now, we can run the container. You can optionally set SIMPLE_POD_CONFIG_DIR and SIMPLE_POD_DATA_DIR, and map the the application directories using `-v`.

```bash
docker run -p 3000:3000 \
  -e SIMPLE_POD_CONFIG_DIR=/app/pod-config \
  -e SIMPLE_POD_DATA_DIR=/app/pod-data \
  -v /path/to/pod-config:/app/pod-config \
  -v /path/to/pod-data:/app/pod-data \
  your-username/your-image-name:latest

```
-p 3000:3000: Maps port 3000 in the container to port 3000 on the host system.
-e SIMPLE_POD_CONFIG_DIR=/app/pod-config: Sets the SIMPLE_POD_CONFIG_DIR environment variable inside the container to the path /app/pod-config.
-e SIMPLE_POD_DATA_DIR=/app/pod-data: Sets the SIMPLE_POD_DATA_DIR environment variable inside the container to the path /app/pod-data.
-v /path/to/pod-config:/app/pod-config: Mounts the host system's /path/to/pod-config to the path /app/pod-config inside the container.
-v /path/to/pod-data:/app/pod-data: Mounts the host system's /path/to/pod-data to the path /app/pod-data inside the container.

License
This Dockerfile and associated documentation are open-source and licensed under the MIT License.

