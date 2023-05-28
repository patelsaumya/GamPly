from django.shortcuts import render
from django.http import HttpResponse
from django.core.files import File
from Wordle_Django.settings import BASE_DIR
import random

import pickle
import os
import json

fileWordsDictJson = os.path.join(BASE_DIR, 'data', 'words_dictionary.json')
fileWordsDictBinary = os.path.join(BASE_DIR, 'data', 'words_dictionary.pk')
fileWordsDictLengthBinary = os.path.join(BASE_DIR, 'data', 'words_dictionary_length.pk')

wordsDict = {}
wordsDictLength = {}

def initiate():
    global wordsDict
    global wordsDictLength
    if not os.path.isfile(fileWordsDictBinary):
        with open(fileWordsDictJson, 'r') as fp:
            data = fp.read()
        wordsDict = json.loads(data)
        with open(fileWordsDictBinary, 'wb') as fp:
            pickle.dump(wordsDict, fp)
    else:
        with open(fileWordsDictBinary, 'rb') as fp:
            wordsDict = pickle.load(fp)

    if not os.path.isfile(fileWordsDictLengthBinary):
        for i in wordsDict:
            if len(i) not in wordsDictLength:
                wordsDictLength[len(i)] = [i]
            else:
                wordsDictLength[len(i)].append(i)
        for i in wordsDictLength:
            random.shuffle(wordsDictLength[i])
        with open(fileWordsDictLengthBinary, 'wb') as fp:
            pickle.dump(wordsDictLength, fp)
    else:
        with open(fileWordsDictLengthBinary, 'rb') as fp:
            wordsDictLength = pickle.load(fp)

    return


# Create your views here.
def fetchWordByLength(request, length):
    if request.method == 'GET':
        initiate()
        return HttpResponse(random.choice(wordsDictLength[length]))
    
def isWordValid(request, word):
    if request.method == 'GET':
        initiate()
        return HttpResponse(f"{word.lower() in wordsDict}")