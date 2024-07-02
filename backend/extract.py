from openai import OpenAI
from tools import pdf_to_text, string_to_dict
from config import API_KEY, TEST_CESIR, CURRENT_MODEL
from extract_tools import retrieve_from_model
# Set your OpenAI API key

# Initiate the openai client
client = OpenAI(
    api_key = API_KEY
)

# Define the function for running the test
# Takes raw text (from a CESIR), returns model output
def get_cost_info(text):
    
    # Prepare the prompt
    prompt = f"""
    Extract the following information from the text:
      - Was a cost share analysis included (true or false)
      - Total cost (non cost share amount)
      - Total cost with cost share (set to 0 if there was no cost share analysis)

    Text:
    {text}

    Provide the extracted information in the following JSON format:
    {{
    "Non Cost Share" : "<total cost (non cost share amount)>",
    "Cost Share" : "<total cost with cost share>",
    "Cost Share Check" : <boolean for whether or not there was a cost share analysis>, 
    }}
    """

    response = retrieve_from_model(prompt = prompt, model = CURRENT_MODEL)

    print(response)

    return string_to_dict(response)

if __name__ == "__main__":

  # Test the function with a new text
  text = pdf_to_text(TEST_CESIR)
  extraction = get_cost_info(text)
  print("Extracted Info:", extraction)