import json

def format_query(query):
    example_json = {
        "query": "",
        "timestamp": "2025-02-10T12:00:00Z",
        "metadata": {
            "source": "user_input",
            "status": "processed"
        }
    }
    
    example_json["query"] = query
    formatted_json = json.dumps(example_json, indent=4)
    print(formatted_json)  # Log the JSON output
    return formatted_json