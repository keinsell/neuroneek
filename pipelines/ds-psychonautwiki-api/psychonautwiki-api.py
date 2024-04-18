# This file is intended to scrape through PsychonautWiki's API and save output
# to the json file which later will be used for the foundation of information in
# application.

import json
import edgedb
from generated_edgeql import substance_by_name,create_substance

def read_operation_from_file(filename):
    """Reads a GraphQL operation from a file."""
    with open(filename, 'r') as f:
        return f.read()


# def graphql_scrape(graphql_url, operation, variables=None, headers=None):
#     """
#     Executes a GraphQL operation and saves the response as a JSON file.

#     Args:
#         graphql_url (str): The URL of the GraphQL endpoint.
#         operation (str): The GraphQL query or mutation string.
#         variables (dict, optional): A dictionary of variables for the operation.
#         headers (dict, optional): HTTP headers for the request.

#     Returns:
#         str: The filename of the created JSON file.
#     """

#     data = {
#         "query": operation,
#         "variables": variables
#     }

#     response = request.post(graphql_url, json=data, headers=headers)
#     response.raise_for_status()  # Raise an exception for error status codes

#     response_data = response.json()

#     if "errors" in response_data:
#         raise Exception("GraphQL errors: {}".format(response_data["errors"]))

#     filename = "out/psychonautwiki.json"
#     with open(filename, 'w') as outfile:
#         json.dump(response_data, outfile, indent=2)

#     return filename

# Example usage
graphql_url = "https://api.psychonautwiki.org/"
operation_filename = "psychonautwiki.operation.graphql"
operation = read_operation_from_file(operation_filename)
headers = None

# filename = graphql_scrape(graphql_url, """
# query AllSubstances {
#     substances(limit: 9999) {
#         name
#         commonNames
#         url
#         class {
#             chemical
#             psychoactive
#         }
#         tolerance {
#             full
#             half
#             zero
#         }
#         roas {
#             name
#             dose {
#                 units
#                 threshold
#                 light {
#                     min
#                     max
#                 }
#                 common {
#                     min
#                     max
#                 }
#                 strong {
#                     min
#                     max
#                 }
#                 heavy
#             }
#             duration {
#                 onset {
#                     min
#                     max
#                     units
#                 }
#                 comeup {
#                     min
#                     max
#                     units
#                 }
#                 peak {
#                     min
#                     max
#                     units
#                 }
#                 offset {
#                     min
#                     max
#                     units
#                 }
#                 total {
#                     min
#                     max
#                     units
#                 }
#                 afterglow {
#                     min
#                     max
#                     units
#                 }
#             }
#             bioavailability {
#                 min
#                 max
#             }
#         }
#         addictionPotential
#         toxicity
#         crossTolerances
#         uncertainInteractions {
#             name
#         }
#         unsafeInteractions {
#             name
#         }
#         dangerousInteractions {
#             name
#         }

#         effects {
#             name
#             url
#         }
#     }
# }
# """, None, headers)

filename="data/psychonautwiki.json"

print(f"GraphQL response saved to {filename}")

client = edgedb.create_client()

# Load the JSON data
with open(filename, 'r') as f:
    data = json.load(f)

# Loop through each substance in the JSON data
for substance in data['data']['substances']:

    substanceName = substance['name']
    print(substanceName)
    # Check if the substance exists in the database
    result = substance_by_name(executor=client, arg=substanceName)

    if result:
        print(f"Substance {substance['name']} exists in the database.")
    else:
        print(f"Substance {substance['name']} does not exist in the database.")

        create_substance(executor=client, name=substanceName, cas_number=substanceName, common_names=[], brand_names=[],
                         substitutive_name=substanceName,
                         chemical_class=substanceName,
                         description="",
                         inchi_key=substanceName,
                         iupac=substanceName,
                         psychoactive_class=[],
                         smiles=substanceName,
                         systematic_name=substanceName,
                         unii=substanceName
                        )