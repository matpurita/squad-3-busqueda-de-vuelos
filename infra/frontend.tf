# =============================
#  Artifact Registry Repository
# =============================
resource "google_artifact_registry_repository" "frontend" {
  repository_id = "frontend"
  description   = "Frontend container images"
  location      = "southamerica-west1"
  format        = "DOCKER"
}

# =============================
#  Cloud Run Service
# =============================
resource "google_cloud_run_service" "frontend" {
  name     = "flightsearch-frontend"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/frontend:latest"
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
}

# =============================
#  IAM Binding – Public Access
# =============================
resource "google_cloud_run_service_iam_binding" "frontend_public" {
  location = google_cloud_run_service.frontend.location
  service  = google_cloud_run_service.frontend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.frontend]
}
