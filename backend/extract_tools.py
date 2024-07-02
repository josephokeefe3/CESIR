from openai import OpenAI
from config import API_KEY

# Set your OpenAI API key
client = OpenAI(api_key=API_KEY)

def generate_prompt(text, fields):
    """
    Generates a prompt based on the provided text and fields.

    Args:
        text (str): The raw text to extract information from.
        fields (dict): A dictionary specifying the fields to extract.

    Returns:
        str: The constructed prompt.
    """
    fields_prompt = "\n".join([f"- {field}" for field in fields.keys()])
    
    prompt = f"""
    Extract the following information from the text:
    {fields_prompt}
    
    Text:
    {text}

    Provide the extracted information in the following JSON format:
    {{
    {", ".join([f'"{key}": "<{key.replace(" ", "_")}>"' for key in fields.keys()])}
    }}
    """
    return prompt

def retrieve_from_model(prompt, model):
    """
    Sends the prompt to the OpenAI API and retrieves the response.

    Args:
        prompt (str): The constructed prompt.

    Returns:
        dict: The response from the OpenAI API as a JSON object.
    """
    completion = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt}
        ]
    )
    
    # Extract the response from the completion
    info = completion.choices[0].message.content

    return info