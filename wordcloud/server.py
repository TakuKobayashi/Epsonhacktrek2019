from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello():
    hello = "Hello world"
    return hello

if __name__ == "__main__":
    app.run()