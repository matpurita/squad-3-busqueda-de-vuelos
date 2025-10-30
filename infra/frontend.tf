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


# =============================
#  Cloud Run Service (Prod)
# =============================
resource "google_cloud_run_service" "frontend_prod" {
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
resource "google_cloud_run_service_iam_binding" "frontend_prod_public" {
  location = google_cloud_run_service.frontend_prod.location
  service  = google_cloud_run_service.frontend_prod.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_service.frontend_prod]
}
