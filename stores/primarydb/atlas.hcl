lint {
  destructive {
    error = false
  }
  data_depend {
    error = true
  }
  incompatible {
    error = true
  }
  naming {
    error   = true
    match   = "^[a-z]+$"
    message = "must be lowercase"
  }
  concurrent_index {
    error = true
  }
}

// Define an environment named "local"
env "local" {
  // Declare where the schema definition resides.
  // Also supported: ["file://multi.hcl", "file://schema.hcl"].
  src = "file://schema.hcl"

  // Define the URL of the Database for this environment
  // See: https://atlasgo.io/concepts/database
  url = "sqlite://file.db?_fk=1"

  // Define the URL of the Dev Database for this environment
  // See: https://atlasgo.io/concepts/dev-database
  dev = "sqlite://file?mode=memory&_fk=1"

  lint {
    latest = 1
  }
}


env "dev" {
  // ... a different env
}
