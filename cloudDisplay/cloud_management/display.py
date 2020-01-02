import functools
import json
import random
import pickle
import os
import sys
import requests
import math

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('display', __name__)

g_attack_status = False

@bp.route('/index', methods=('POST', 'GET'))
def index():
    return render_template('html/cloudIndex.html')

@bp.route('/startAttack', methods=('POST', 'GET'))
def startAttack():
    return render_template('html/attackStart.html')

@bp.route('/getCmdLines', methods=('POST', 'GET'))
def getCmdLines():
    with open('./displaycmd.txt', 'rb') as fr:
        lines = fr.readlines()
    lines = [line+'</br>' for line in lines]
    lines = [line.replace(' ', '&nbsp;&nbsp;') for line in lines]
    
    return render_template('html/attackCmdDisplay.html', cmd=lines)

@bp.route('/attackStart', methods=('POST', 'GET'))
def attackStart():
    # os.system('python testpython.py')
    global g_attack_status
    g_attack_status = True

    url = 'http://10.1.119.231:5000/attackStart'
    requests.post(url)
    return json.dumps([{
            'code':200,
            'attack_status':g_attack_status,
    }])

@bp.route('/defenceStart', methods=('POST', 'GET'))
def defenceStart():
    global g_attack_status
    try:
        url = "http://10.1.119.231:5000/startDefence"
        requests.post(url)
    except:
        return json.dumps([{
            'code':200,
            'attack_status':g_attack_status,
        }])
    else:
        g_attack_status = False
        return json.dumps([{
            'code':200,
            'attack_status':g_attack_status,
        }])
    

@bp.route('/getAttackStatus', methods=('POST', 'GET'))
def getAttackStatus():
    global g_attack_status
    return json.dumps([{
        'attack_status':g_attack_status
    }])
