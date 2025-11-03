# =============================
#  Docker Image Build (Prod)
# =============================
resource "docker_image" "frontend" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/prod:latest"
  build {
    path       = "${path.module}/../frontend"
    dockerfile = "${path.module}/../frontend/Dockerfile"

    build_arg = {
      ENV = "prod"
    }
  }

  depends_on = [google_artifact_registry_repository.frontend]
}

# =============================
#  Cloud Run Service (Prod)
# =============================
resource "google_cloud_run_service" "frontend" {
  name     = "flightsearch-frontend-prod"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/prod:latest"
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
#  IAM Binding – Public Access (Prod)
# ===================================
resource "google_cloud_run_service_iam_binding" "frontend_public" {
  location = google_cloud_run_service.frontend.location
  service  = google_cloud_run_service.frontend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.frontend]
}
