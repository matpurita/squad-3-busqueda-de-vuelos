# =============================
#  Docker Image Build (Dev)
# =============================
resource "docker_image" "backend" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/backend/dev:latest"
  build {
    path = "${path.module}/../../back"

    build_arg = {
      ENV = "dev"
    }
  }

  keep_locally = false

  depends_on = [google_artifact_registry_repository.backend]
}

resource "null_resource" "push_backend_image" {
  triggers = {
    repo_digest = docker_image.backend.repo_digest
  }

  provisioner "local-exec" {
    command = "docker push southamerica-west1-docker.pkg.dev/uade-476411/backend/dev:latest"
  }
}

# =============================
#  Cloud Run Service (Dev)
# =============================
resource "google_cloud_run_service" "backend" {
  name     = "flightsearch-backend-dev"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/backend/dev:latest"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].spec[0].containers[0].env
    ]
  }

  depends_on = [null_resource.push_backend_image]
}

# ===================================
#  IAM Binding – Public Access (Dev)
# ===================================
resource "google_cloud_run_service_iam_binding" "backend_public" {
  location = google_cloud_run_service.backend.location
  service  = google_cloud_run_service.backend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.backend]
}
