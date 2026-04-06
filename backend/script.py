import google.generativeai as genai

genai.configure(api_key="AIzaSyCZV6JD_p348i9473Ewe6ebFl2eJZpRdL8")

models = genai.list_models()

for m in models:
    print(m.name, m.supported_generation_methods)