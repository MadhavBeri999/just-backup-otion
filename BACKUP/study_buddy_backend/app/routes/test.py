import google.generativeai as genai
import os

genai.configure(api_key="AIzaSyCg_wRtvE1kxUvhw6BZgs6LpnIIn1o8ako")

for m in genai.list_models():
    print(m.name)
