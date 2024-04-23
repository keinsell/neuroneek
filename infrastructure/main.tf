locals {
  environments = {
    development = "development"
    preview     = "preview"
    production  = "production"
  }
}

terraform {
  cloud {
    organization = "keinsell"
    workspaces {
      project = "neuronek"
      tags    = ["production"]
    }
  }
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 1.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.4.3"
    }
    infisical = {
      source = "infisical/infisical"
    }
    github = {
      source  = "integrations/github"
      version = "~> 5.0"
    }
  }
}

variable "vercel_api_token" {
  description = "https://vercel.com/account/tokens"
  type        = string
}

variable "vercel_team" {
  # TODO: Maybe migrate to separate team dedicated for app?
  default = "0x4b696973656c6c"
}


variable "github_token" {
  description = "https://github.com/settings/tokens"
  type        = string
}

variable "github_owner" {
  default = "keinsell"
}

provider "vercel" {
  api_token = var.vercel_api_token
  team      = var.vercel_team
}

provider "github" {
  token = var.github_token
  owner = var.github_owner
}


# For the importing resources useful tool is
# go install github.com/paololazzari/fuzzy-terraform-import@latest
# fuzzy-terraform-import

# terraform import github_repository.this neuronek
resource "github_repository" "this" {
  name                        = "neuronek"
  description                 = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
  visibility                  = "public"
  delete_branch_on_merge      = true
  allow_update_branch         = true
  allow_auto_merge            = true
  has_downloads               = true
  has_issues                  = true
  has_discussions = true
  has_projects                = false
  has_wiki                    = false
  homepage_url                = "https://neuronek.xyz"
  is_template                 = false
  merge_commit_message        = "PR_BODY"
  merge_commit_title          = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"
  squash_merge_commit_title   = "PR_TITLE"
  vulnerability_alerts        = true
}


resource "github_repository_environment" "development" {
  environment         = "development"
  repository          = github_repository.this.name
  deployment_branch_policy {
    protected_branches     = true
    custom_branch_policies = false
  }
}

resource "github_repository_environment" "production" {
  environment         = "production"
  repository          = github_repository.this.name
  deployment_branch_policy {
    protected_branches     = true
    custom_branch_policies = false
  }
}

# pharmacology neuroscience nootropics supplements psychedelics psychedelic psychonautwiki harm-reduction caffeine-tracker erowid substance-use-disorder substance-use tripsit psychedelic-research substance-use-and-prevention
resource "github_repository_topics" "this" {
  repository    = github_repository.this.name
  topics        = ["psychonautwiki", "erowid", "tripsit", "caffeine-tracker"]
}


# terraform import vercel_project.neuronek-web prj_XdZqT52RvtlXl9ynuyQerkiIrcZ7
resource "vercel_project" "neuronek-web" {
  name      = "neuronek-web"
  framework = "nextjs"
  git_repository = {
    production_branch = "trunk"
    repo              = "${var.github_owner}/${github_repository.this.name}"
    type              = "github"
  }
  root_directory             = "apps/web"
  serverless_function_region = "iad1"
  team_id                    = "team_tdTscGRSFAYwCqYqmjaeiS9B"
  vercel_authentication = {
    deployment_type = "none"
  }
  depends_on = [
    github_repository.this
  ]
}
