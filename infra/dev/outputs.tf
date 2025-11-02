output "backend_url_dev" {
  description = "Public URL of the backend Cloud Run service (Dev)"
  value       = google_cloud_run_service.backend_dev.status[0].url
  depends_on  = [google_cloud_run_service.backend_dev]
}

output "frontend_url_dev" {
  description = "Public URL of the frontend Cloud Run service (Dev)"
  value       = google_cloud_run_service.frontend_dev.status[0].url
  depends_on  = [google_cloud_run_service.frontend_dev]
}