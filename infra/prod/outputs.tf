output "backend_url_prod" {
  description = "Public URL of the backend Cloud Run service (Prod)"
  value       = google_cloud_run_service.backend_prod.status[0].url
  depends_on  = [google_cloud_run_service.backend_prod]
}

output "frontend_url_prod" {
  description = "Public URL of the frontend Cloud Run service (Prod)"
  value       = google_cloud_run_service.frontend_prod.status[0].url
  depends_on  = [google_cloud_run_service.frontend_prod]
}
