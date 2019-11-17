# coding:utf-8

from flask import Flask, render_template, request, jsonify, send_file
from wordcloud import WordCloud
import uuid
import MeCab
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import json
import smtplib
from email.utils import formatdate
from smtplib import SMTP
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
import ssl

import os
from os.path import join, dirname
from dotenv import load_dotenv

load_dotenv(verbose=True)

dotenv_path = join(dirname(__file__), '.env')
load_dotenv(dotenv_path)

FROM_ADDRESS = os.environ.get("FROM_ADDRESS")
MY_PASSWORD = os.environ.get("MAIL_PASSWORD")
TO_ADDRESS = os.environ.get("TO_ADDRESS")
BCC = ''
SUBJECT = 'GmailのSMTPサーバ経由'
BODY = ''

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
  return render_template('index.html', title='input words page')

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

  msg = create_message(FROM_ADDRESS, TO_ADDRESS, BCC, SUBJECT, BODY, image_file_path)
  send(FROM_ADDRESS, TO_ADDRESS, msg)

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

def create_message(from_addr, to_addr, bcc_addrs, subject, body, image_file_path):
    msg = MIMEMultipart(body)
    msg['Subject'] = subject
    msg['From'] = from_addr
    msg['To'] = to_addr
    msg['Bcc'] = bcc_addrs
    msg['Date'] = formatdate()

    # 添付ファイルの設定
    attach_file = {'name': os.path.basename(image_file_path), 'path': image_file_path}
    attachment = MIMEBase('image', 'png')
    file = open(attach_file['path'], 'rb+')
    attachment.set_payload(file.read())
    file.close()
    encoders.encode_base64(attachment)
    attachment.add_header("Content-Disposition", "attachment", filename=attach_file['name'])
    msg.attach(attachment)
    return msg


def send(from_addr, to_addrs, msg):
    #context = ssl.create_default_context()
    smtpobj = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=20)
    smtpobj.login(FROM_ADDRESS, MY_PASSWORD)
    smtpobj.mail(FROM_ADDRESS)
    smtpobj.rcpt(TO_ADDRESS)
    smtpobj.data(msg.as_string())
    smtpobj.quit()

if __name__ == "__main__":
  app.debug = True
  app.host = '0.0.0.0'
  app.threaded = True
  server = pywsgi.WSGIServer(("", 5000), app, handler_class=WebSocketHandler)
  server.serve_forever()