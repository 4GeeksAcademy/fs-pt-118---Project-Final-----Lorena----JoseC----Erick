from flask import jsonify, url_for, current_app
from itsdangerous import URLSafeTimedSerializer
import os
from flask_mail import Message




def generate_reset_token(email):
    s = URLSafeTimedSerializer(os.getenv("JWT_SECRET_KEY"))
    return s.dumps(email, salt="password-reset")

def verify_reset_token(token, expiration=900):
    s = URLSafeTimedSerializer(os.getenv("JWT_SECRET_KEY"))
    try:
        email = s.loads(token, salt="password-reset", max_age=expiration)
        return email
    except Exception:
        return None



def send_reset_email(user):
    token = generate_reset_token(user.email)
    reset_url = f"{os.getenv('FRONTEND_URL')}/reset-password?token={token}"

    msg = Message(
        subject="Recuperación de contraseña",
        sender=current_app.config['MAIL_USERNAME'],
        recipients=[user.email]
    )
    msg.body = f"""Hello {user.user_name},

We received a request to reset your password. Click the link below to proceed:

{reset_url}

This link will expire in 15 minutes. If you did not request this change, you can ignore this message.
"""
    current_app.extensions['mail'].send(msg)



class APIException(Exception):
    status_code = 400

    def __init__(self, message, status_code=None, payload=None):
        Exception.__init__(self)
        self.message = message
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['message'] = self.message
        return rv

def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)

def generate_sitemap(app):
    links = ['/admin/']
    for rule in app.url_map.iter_rules():
        # Filter out rules we can't navigate to in a browser
        # and rules that require parameters
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if "/admin/" not in url:
                links.append(url)

    links_html = "".join(["<li><a href='" + y + "'>" + y + "</a></li>" for y in links])
    return """
        <div style="text-align: center;">
        <img style="max-height: 80px" src='https://storage.googleapis.com/breathecode/boilerplates/rigo-baby.jpeg' />
        <h1>Rigo welcomes you to your API!!</h1>
        <p>API HOST: <script>document.write('<input style="padding: 5px; width: 300px" type="text" value="'+window.location.href+'" />');</script></p>
        <p>Start working on your project by following the <a href="https://start.4geeksacademy.com/starters/full-stack" target="_blank">Quick Start</a></p>
        <p>Remember to specify a real endpoint path like: </p>
        <ul style="text-align: left;">"""+links_html+"</ul></div>"
