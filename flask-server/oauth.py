# oauth.py
from flask import current_app as app, request, jsonify
from oauthlib.oauth2 import WebApplicationClient
import requests

client = WebApplicationClient(app.config['GOOGLE_CLIENT_ID'])

def get_google_provider_cfg():
    return requests.get(app.config['GOOGLE_DISCOVERY_URL']).json()

def google_login():
    code = request.json.get('code')
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg['token_endpoint']
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_uri='http://localhost:3000/auth/callback',  # Match with your frontend redirect URI
        code=code
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(app.config['GOOGLE_CLIENT_ID'], app.config['GOOGLE_CLIENT_SECRET'])
    )
    client.parse_request_body_response(token_response.text)
    userinfo_endpoint = google_provider_cfg['userinfo_endpoint']
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)
    user_info = userinfo_response.json()
    return user_info
