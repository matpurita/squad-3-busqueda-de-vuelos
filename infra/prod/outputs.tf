output "backend_url" {
  description = "Public URL of the backend Cloud Run service (Prod)"
  value       = google_cloud_run_v2_service.backend.uri
  depends_on  = [google_cloud_run_v2_service.backend]
}

output "frontend_url" {
  description = "Public URL of the frontend Cloud Run service (Prod)"
  value       = google_cloud_run_v2_service.frontend.uri
  depends_on  = [google_cloud_run_v2_service.frontend]
}
