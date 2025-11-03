output "backend_url" {
  description = "Public URL of the backend Cloud Run service (Prod)"
  value       = google_cloud_run_service.backend.status[0].url
  depends_on  = [google_cloud_run_service.backend]
}

output "frontend_url" {
  description = "Public URL of the frontend Cloud Run service (Prod)"
  value       = google_cloud_run_service.frontend.status[0].url
  depends_on  = [google_cloud_run_service.frontend]
}
