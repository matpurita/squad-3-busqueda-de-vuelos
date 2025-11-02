# =============================
#  Docker Image Build (Prod)
# =============================
resource "docker_image" "backend_prod" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/backend/prod:latest"
  build {
    path       = "${path.module}/../frontend"
    dockerfile = "${path.module}/../frontend/Dockerfile"

    build_arg = {
      ENV = "prod"
    }
  }

  depends_on = [google_artifact_registry_repository.backend]
}

# =============================
#  Cloud Run Service (Prod)
# =============================
resource "google_cloud_run_service" "backend_prod" {
  name     = "flightsearch-backend-prod"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/backend/prod:latest"
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
#  IAM Binding – Public Access (Prod)
# ===================================
resource "google_cloud_run_service_iam_binding" "backend_prod_public" {
  location = google_cloud_run_service.backend_prod.location
  service  = google_cloud_run_service.backend_prod.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.backend_prod]
}
