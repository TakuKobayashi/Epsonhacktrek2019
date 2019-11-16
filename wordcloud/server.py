# coding:utf-8

from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
  return render_template('index.html', title='sample page')

@app.route("/generate", methods=["POST"])
def generate():
  sentence = request.form['sentence']
  return render_template('index.html', title=sentence)

if __name__ == "__main__":
  app.run(debug=True, host='0.0.0.0', threaded=True)