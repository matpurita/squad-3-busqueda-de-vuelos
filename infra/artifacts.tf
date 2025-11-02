# ========================================
#  Artifact Registry Repository (Frontend)
# ========================================
resource "google_artifact_registry_repository" "frontend" {
  repository_id = "frontend"
  description   = "Frontend container images"
  location      = "southamerica-west1"
  format        = "DOCKER"
}

# ========================================
#  Artifact Registry Repository (Backend)
# ========================================
resource "google_artifact_registry_repository" "backend" {
  repository_id = "backend"
  description   = "Backend container images"
  location      = "southamerica-west1"
  format        = "DOCKER"
}
