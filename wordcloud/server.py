# coding:utf-8

from flask import Flask, render_template, request, jsonify, send_file
from wordcloud import WordCloud
import uuid
import MeCab
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import json

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
  return render_template('index.html', title='sample page')

@app.route("/generate", methods=["POST"])
def generate():
  sentence = request.form['sentence']
  mecab = MeCab.Tagger('-d /usr/local/lib/mecab/dic/mecab-ipadic-neologd')
  nodes = mecab.parseToNode(sentence)
  s = []
  while nodes:
    if nodes.feature[:2] == '名詞':
      s.append(nodes.surface)
    nodes = nodes.next
  wc = WordCloud(width=480, height=320, background_color="white",
                 stopwords={"もの","これ","ため","それ","ところ","よう"},
                 font_path="/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc")
  wc.generate(" ".join(s))
  image_file_path = "images/tmp/" + str(uuid.uuid4()) + ".png"
  wc.to_file(image_file_path)
  return jsonify({'image_url': request.url_root + image_file_path})

@app.route("/images/tmp/<path:path>")
def tmp_images(path):
    fullpath = "./images/tmp/" + path
    return send_file(fullpath, mimetype='image/png')

@app.route('/pipe')
def pipe():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']

        while True:
            message = ws.receive()
            if message is None:
                break
            print(message)
            ws.send(json.dumps({message: message}))

if __name__ == "__main__":
  app.debug = True
  app.host = '0.0.0.0'
  app.threaded = True
  server = pywsgi.WSGIServer(("", 5000), app, handler_class=WebSocketHandler)
  server.serve_forever()