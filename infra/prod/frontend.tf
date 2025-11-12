# =============================
#  Docker Image Build (Prod)
# =============================
resource "docker_image" "frontend" {
  name = "southamerica-west1-docker.pkg.dev/uade-476411/frontend/prod:latest"
  build {
    path = "${path.module}/../../front"

    build_arg = {
      ENV          = "prod"
      VITE_API_URL = "https://flightsearch-backend-prod-778211537053.southamerica-west1.run.app"
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
#  Cloud Run Service (Prod)
# =============================
resource "google_cloud_run_v2_service" "frontend" {
  name     = "flightsearch-frontend-prod"
  location = "southamerica-west1"

  template {
    containers {
      image = docker_image.frontend.name
      ports {
        container_port = 80
      }
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
#  IAM Binding – Public Access (Prod)
# ===================================
resource "google_cloud_run_service_iam_binding" "frontend_public" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  members  = ["allUsers"]

  depends_on = [google_cloud_run_v2_service.frontend]
}
