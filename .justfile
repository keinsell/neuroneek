default:
    just --list

# TODO: Build docker image
# TODO: Build docker imgage with nixpack
# TODO: Build apps and packages
# TODO: Run development mode
# TODO: Run tests
# TODO: Run linters
# TODO: Update change logs
# TODO: Mainupulate database

_tlbs_generate_database_documentation:
    tlbs doc

_tlbs_database_diff:
    tlbs diff

_tlbs_database_lint:
    tlbs diff

# Creates a symlink file to .env contained at root of repository, somehow I find this method
# useful for managing environment in monorepos.
_create_applicaiton_symlink_to_environmet_file application:
    ln -s ../../.env apps/{{application}}/.env
