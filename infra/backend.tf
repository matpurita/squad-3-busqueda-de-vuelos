# =============================
#  Artifact Registry Repository
# =============================
resource "google_artifact_registry_repository" "backend" {
  repository_id = "backend"
  description   = "Backend container images"
  location      = "southamerica-west1"
  format        = "DOCKER"
}

# =============================
#  Cloud Run Service
# =============================
resource "google_cloud_run_service" "backend" {
  name     = "flightsearch-backend-${var.env}"
  location = "southamerica-west1"

  template {
    spec {
      containers {
        image = "southamerica-west1-docker.pkg.dev/uade-476411/backend/backend:${var.env}"
      }
    }
  }
}

# =============================
#  IAM Binding – Public Access
# =============================
resource "google_cloud_run_service_iam_binding" "backend_public" {
  location = google_cloud_run_service.backend.location
  service  = google_cloud_run_service.backend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.backend]
}
