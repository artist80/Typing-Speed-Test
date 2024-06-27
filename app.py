from flask import Flask, render_template, request, jsonify
import time

app = Flask(__name__)

paragraph = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet, making it a popular choice for typing practice. Typing is a valuable skill that improves with consistent practice and accuracy. Keep typing and improve your speed every day!"

@app.route('/')
def index():
    return render_template('index.html', paragraph=paragraph)

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    typed_text = data.get('typed_text', '')
    words = typed_text.split()
    paragraph_words = paragraph.split()
    correct_words = sum(1 for a, b in zip(words, paragraph_words) if a == b)
    accuracy = (correct_words / len(paragraph_words)) * 100
    return jsonify({'accuracy': accuracy, 'correct_words': correct_words, 'total_words': len(paragraph_words)})

if __name__ == "__main__":
    app.run(debug=True)
