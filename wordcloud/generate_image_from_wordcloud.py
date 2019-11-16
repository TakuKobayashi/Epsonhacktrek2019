# coding:utf-8

from wordcloud import WordCloud
import MeCab

mecab = MeCab.Tagger()

with open('sample.txt') as f:
    text = f.read()

nodes = mecab.parseToNode(text)
s = []
while nodes:
  if nodes.feature[:2] == '名詞':
    s.append(nodes.surface)
  nodes = nodes.next

wc = WordCloud(width=480, height=320, background_color="white",
               stopwords={"もの","これ","ため","それ","ところ","よう"},
               font_path="/System/Library/Fonts/ヒラギノ角ゴシック W6.ttc")
wc.generate(" ".join(s))
wc.to_file('wc3.png')