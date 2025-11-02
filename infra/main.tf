terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "6.8.0"
    }

    docker = {
      source  = "kreuzwerker/docker"
      version = "2.22.0"
    }
  }

  required_version = ">= 1.5.0"
}

provider "google" {
  project = "uade-476411"
  region  = "southamerica-west1"
  zone    = "southamerica-west1-a"
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

resource "google_compute_network" "vpc_network" {
  name = "terraform-network"
}
