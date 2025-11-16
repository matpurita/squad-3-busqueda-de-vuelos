# =============================
#  Docker Image Build (Dev)
# =============================
resource "docker_image" "frontend" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/dev:latest"
  build {
    path = "${path.module}/../../front"

    build_arg = {
      ENV          = "dev"
      VITE_API_URL = "https://flightsearch-backend-dev-778211537053.southamerica-west1.run.app"
    }
  }

  depends_on = [google_artifact_registry_repository.frontend]
}

resource "null_resource" "push_frontend_image" {
  triggers = {
    repo_digest = docker_image.frontend.repo_digest
  }

  provisioner "local-exec" {
    command = "docker push ${docker_image.frontend.name}"
  }
}

# =============================
#  Cloud Run Service (Dev)
# =============================
resource "google_cloud_run_v2_service" "frontend" {
  name     = "flightsearch-frontend-dev"
  location = "southamerica-west1"

  template {
    containers {
      image = docker_image.frontend.name
      ports {
        container_port = 80
      }
    }
  
    annotations = {
      "image-digest" = docker_image.frontend.repo_digest
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].env
    ]
  }

  depends_on = [docker_image.frontend, null_resource.push_frontend_image]
}

# ===================================
#  IAM Binding – Public Access (Dev)
# ===================================
resource "google_cloud_run_service_iam_binding" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_v2_service.frontend]
}