from gtts import gTTS
import os

# Create audio directory if it doesn't exist
if not os.path.exists('audio'):
    os.makedirs('audio')

# List of greetings and their Spanish text
greetings = {
    'hola': 'hola',
    'buenos-dias': 'buenos días',
    'buenas-tardes': 'buenas tardes',
    'buenas-noches': 'buenas noches',
    'como-te-llamas': '¿Cómo te llamas?',
    'mucho-gusto': 'mucho gusto',
    'de-donde-eres': '¿De dónde eres?',
    'como-estas': '¿Cómo estás?'
}

# Generate audio files
for filename, text in greetings.items():
    print(f"Generating audio for: {text}")
    tts = gTTS(text=text, lang='es')
    tts.save(f"audio/{filename}.mp3")
    print(f"Saved: audio/{filename}.mp3")

print("\nAll audio files have been generated successfully!") 