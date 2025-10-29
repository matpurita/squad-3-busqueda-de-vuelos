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
