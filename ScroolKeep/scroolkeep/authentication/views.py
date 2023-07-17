from rest_framework import response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer

import json
import requests


from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt


from constants.views import *


@csrf_exempt
@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")

    payload = json.dumps(
        {"email": email, "password": password, "returnSecureToken": True}
    )

    r = requests.post(
        LOGIN_URL,
        params={"key": LOGIN_KEY},
        data=payload,
    )
    auth_resp = json.loads(json.dumps(r.json()))
    token = get_token(request)
    try:
        handle_ref = get_documents(
            collection="authorInfo", docId=auth_resp["localId"], get_reference=True
        )
        handle = handle_ref.get().to_dict()
        resp = {
            "displayName": handle["displayName"],
            "userHandle": handle["handle"],
            "profilePic": handle["profilePic"],
            "loginId": token,
        }
        update_status = update_document(
            collection="authorInfo",
            docId=auth_resp["localId"],
            updateData={"loginId": token},
        )
        return response.Response(resp)
    except:
        return response.Response(auth_resp)


@csrf_exempt
@api_view(("POST",))
@renderer_classes((TemplateHTMLRenderer, JSONRenderer))
def register(request):
    email = request.data.get("email")
    password = request.data.get("password")
    displayName = request.data.get("displayName")
    userHandle = request.data.get("handle")
    # print(email, password)

    try:
        where = [{"field": "handle", "comparator": "==", "value": userHandle}]
        handleCheck = len(get_documents(collection="authorInfo", where=where))
        if handleCheck > 0:
            return response.Response("HANDLE_EXISTS")

        userInfo = createUser(
            email=email,
            password=password,
            displayName=displayName,
            userHandle=userHandle,
            profilePic=DEFAULT_AVATAR,
            bannerPic=DEFAULT_BANNER,
        )

        return response.Response(
            {
                "displayname": userInfo.display_name,
                "userHandle": userHandle,
            }
        )
    except Exception as e:
        if str(e) == "INVALID_EMAIL":
            return response.Response({"exception": str(e), "code": "INVALID_EMAIL"})
        else:
            return response.Response({"exception": str(e), "code": "USER_EXISTS"})
