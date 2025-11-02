# =============================
#  Docker Image Build (Dev)
# =============================
resource "docker_image" "frontend_dev" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/dev:latest"
  build {
    path       = "${path.module}/../frontend"
    dockerfile = "${path.module}/../frontend/Dockerfile"

    build_arg = {
      ENV = "dev"
    }
  }

  depends_on = [google_artifact_registry_repository.frontend]
}

# =============================
#  Cloud Run Service (Dev)
# =============================
resource "google_cloud_run_service" "frontend_dev" {
  name     = "flightsearch-frontend-dev"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/dev:latest"
        ports {
          container_port = 80
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
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
resource "google_cloud_run_service_iam_binding" "frontend_dev_public" {
  location = google_cloud_run_service.frontend_dev.location
  service  = google_cloud_run_service.frontend_dev.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.frontend_dev]
}