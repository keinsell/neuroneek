// Terraform managed Github Repository
//
// This is intended to manage deployment environments, secrets and overall configuration
// of organization as not everything can be done within CI/CD and I think
// forwarding secrets from infra to CI is more convenient than the other way
// around. At least I do not waste time configuring this shit every time, and
// ex. when database migration is made through CI/CD and rotation of keys on
// db is enabled things tend to get a little funky.
//
// I do not recommend defining repository from scratch on Terraform, however
// this can be easily resolved by:
// $ terraform import github_repository.terraform terraform
//

provider "github" {
  token = var.github_token
  owner = var.github_owner
}

resource "github_repository" "this" {
  name                        = "neuronek"
  description                 = "🧬 Intelligent dosage tracker application with purpose to monitor supplements, nootropics and psychoactive substances along with their long-term influence on one's mind and body."
  delete_branch_on_merge      = true
  allow_update_branch         = true
  allow_auto_merge            = true
  has_downloads               = true
  has_issues                  = true
  has_projects                = true
  has_wiki                    = true
  homepage_url                = "${koyeb_app.this.domains[0].name}/api"
  is_template                 = true
  merge_commit_message        = "PR_BODY"
  merge_commit_title          = "PR_TITLE"
  squash_merge_commit_message = "PR_BODY"
  squash_merge_commit_title   = "PR_TITLE"
  vulnerability_alerts        = true
}

# Github Application must be created before manually
# https://develop.sentry.dev/integrations/github/
# https://github.com/integrations/terraform-provider-github/issues/509
#resource "github_app_installation_repository" "sentry" {
#  installation_id = ""
#  repository      = ""
#}