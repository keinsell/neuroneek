# This file is intended to scrape through PsychonautWiki's API and save output
# to the json file which later will be used for the foundation of information in
# application.

import requests
import json

def read_operation_from_file(filename):
    """Reads a GraphQL operation from a file."""
    with open(filename, 'r') as f:
        return f.read()


def graphql_scrape(graphql_url, operation, variables=None, headers=None):
    """
    Executes a GraphQL operation and saves the response as a JSON file.

    Args:
        graphql_url (str): The URL of the GraphQL endpoint.
        operation (str): The GraphQL query or mutation string.
        variables (dict, optional): A dictionary of variables for the operation.
        headers (dict, optional): HTTP headers for the request.

    Returns:
        str: The filename of the created JSON file.
    """

    data = {
        "query": operation,
        "variables": variables
    }

    response = requests.post(graphql_url, json=data, headers=headers)
    response.raise_for_status()  # Raise an exception for error status codes

    response_data = response.json()

    if "errors" in response_data:
        raise Exception("GraphQL errors: {}".format(response_data["errors"]))

    filename = "out/psychonautwiki.json"
    with open(filename, 'w') as outfile:
        json.dump(response_data, outfile, indent=2)

    return filename

# Example usage
graphql_url = "https://api.psychonautwiki.org/"
operation_filename = "psychonautwiki.operation.graphql"
operation = read_operation_from_file(operation_filename)
headers = None

filename = graphql_scrape(graphql_url, """
query AllSubstances {
    substances(limit: 9999) {
        name
        commonNames
        url
        class {
            chemical
            psychoactive
        }
        tolerance {
            full
            half
            zero
        }
        roas {
            name
            dose {
                units
                threshold
                light {
                    min
                    max
                }
                common {
                    min
                    max
                }
                strong {
                    min
                    max
                }
                heavy
            }
            duration {
                onset {
                    min
                    max
                    units
                }
                comeup {
                    min
                    max
                    units
                }
                peak {
                    min
                    max
                    units
                }
                offset {
                    min
                    max
                    units
                }
                total {
                    min
                    max
                    units
                }
                afterglow {
                    min
                    max
                    units
                }
            }
            bioavailability {
                min
                max
            }
        }
        addictionPotential
        toxicity
        crossTolerances
        uncertainInteractions {
            name
        }
        unsafeInteractions {
            name
        }
        dangerousInteractions {
            name
        }

        effects {
            name
            url
        }
    }
}
""", None, headers)
print(f"GraphQL response saved to {filename}")
