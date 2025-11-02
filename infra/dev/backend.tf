# =============================
#  Docker Image Build (Dev)
# =============================
resource "docker_image" "backend_dev" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/backend/dev:latest"
  build {
    path       = "${path.module}/../frontend"
    dockerfile = "${path.module}/../frontend/Dockerfile"

    build_arg = {
      ENV = "dev"
    }
  }

  depends_on = [google_artifact_registry_repository.backend]
}

# =============================
#  Cloud Run Service (Dev)
# =============================
resource "google_cloud_run_service" "backend_dev" {
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
}

# ===================================
#  IAM Binding – Public Access (Dev)
# ===================================
resource "google_cloud_run_service_iam_binding" "backend_dev_public" {
  location = google_cloud_run_service.backend_dev.location
  service  = google_cloud_run_service.backend_dev.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.backend_dev]
}
