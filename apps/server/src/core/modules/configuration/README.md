# Configuration

- `Configurator` will look for application configuration files, then will
  search environment variables and at the end if environment variables
  provided external secret providers will hit them up for secrets.
  If configuration was not satfied error will be thrown.
