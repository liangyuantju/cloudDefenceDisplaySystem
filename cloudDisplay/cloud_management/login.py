from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

bp = Blueprint('login', __name__)

@bp.route('/signin', methods=('POST', 'GET'))
def signin():
    if request.method == "POST":
        username = request.form['username']
        password = request.form['password']

        if username == "admin" and password == "admin":
            return redirect(url_for('display.index'))

    return render_template('html/signin.html')

