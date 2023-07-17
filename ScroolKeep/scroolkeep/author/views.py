from rest_framework import status, response
from rest_framework.decorators import api_view
import uuid

from constants.views import *


@api_view(("POST",))
def addFollow(request):
    user = request.data.get("user")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=user, loginId=loginId)

    if signedInCheck["status"]:
        authorHandle = request.data.get("author")  # author to follow
        where = [
            {"field": "handle", "comparator": "==", "value": authorHandle},
        ]
        authorId = get_documents(collection="authorInfo", where=where)[0]["id"]

        uid = signedInCheck["uid"]

        if authorId == uid:
            return response.Response("cannot subscribe to yourself")

        where = [
            {"field": "user", "comparator": "==", "value": uid},
            {"field": "follows", "comparator": "==", "value": authorId},
        ]
        document = get_documents(collection="follows", where=where)
        if len(document) == 0:
            documentData = {
                "document": {"user": uid, "follows": authorId},
                "meta": {"collection": "follows"},
            }
            status = create_document(documentData=documentData)
        else:
            status = delete_document(collection="follows", docId=document[0]["id"])
        return response.Response(status)
    else:
        return response.Response(signedInCheck["error"])


@api_view(("POST",))
def setAuthorInfo(request):
    user = request.data.get("user")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=user, loginId=loginId)

    if signedInCheck["status"]:
        uid = signedInCheck["uid"]
        updateData = {
            "displayName": request.data.get("displayName"),
            "bio": request.data.get("bio"),
        }
        status = update_document(
            collection="authorInfo", docId=uid, updateData=updateData
        )

        try:
            profilePic = request.FILES["profilePic"]
            author_info = get_documents(collection="authorInfo", docId=uid)
            if "mediaId" not in author_info:
                mediaId = uuid.uuid4().hex
                update_document(
                    collection="authorInfo",
                    docId=uid,
                    updateData={"mediaId": mediaId},
                )
            else:
                mediaId = author_info["mediaId"]
            pp_destination_path = mediaId + "/profile_" + uuid.uuid4().hex

            if "profilePic" in author_info:
                profileURL = author_info["profilePic"]
            else:
                profileURL = None
            profileURL = update_storage(
                current_file_url=profileURL,
                new_file=profilePic,
                new_destination=pp_destination_path,
            )

            updateData = {
                "profilePic": profileURL,
            }
            status = update_document(
                collection="authorInfo", docId=uid, updateData=updateData
            )
        except Exception as e:
            print(str(e))

        try:
            bannerPic = request.FILES["bannerPic"]
            author_info = get_documents(collection="authorInfo", docId=uid)
            if "mediaId" not in author_info:
                mediaId = uuid.uuid4().hex
                update_document(
                    collection="authorInfo",
                    docId=uid,
                    updateData={"mediaId": mediaId},
                )
            else:
                mediaId = author_info["mediaId"]
            bp_destination_path = mediaId + "/banner_" + uuid.uuid4().hex

            if "bannerPic" in author_info:
                bannerURL = author_info["bannerPic"]
            else:
                bannerURL = None
            bannerURL = update_storage(
                current_file_url=bannerURL,
                new_file=bannerPic,
                new_destination=bp_destination_path,
            )
            updateData = {
                "bannerPic": bannerURL,
            }
            status = update_document(
                collection="authorInfo", docId=uid, updateData=updateData
            )
        except Exception as e:
            print(str(e))

        return response.Response(status)
    else:
        return response.Response(signedInCheck["error"])


@api_view(("GET",))
def getAuthorInfo(request):
    author = request.GET.get("author")
    where = [
        {"field": "handle", "comparator": "==", "value": author},
    ]
    authorId = get_documents(collection="authorInfo", where=where)[0]["id"]

    where = [
        {"field": "follows", "comparator": "==", "value": authorId},
    ]

    followers = get_documents(collection="follows", where=where)
    for document_index in range(len(followers)):
        followers[document_index] = get_documents(
            collection="authorInfo", docId=followers[document_index]["user"]
        )["handle"]

    where = [
        {"field": "user", "comparator": "==", "value": authorId},
    ]

    follows = get_documents(collection="follows", where=where)
    for document_index in range(len(follows)):
        follows[document_index] = get_documents(
            collection="authorInfo", docId=follows[document_index]["follows"]
        )["handle"]

    authorInfo = get_documents(collection="authorInfo", docId=authorId)
    if "bio" not in authorInfo:
        authorInfo["bio"] = ""
    if "profilePic" not in authorInfo:
        authorInfo["profilePic"] = DEFAULT_AVATAR
    if "bannerPic" not in authorInfo:
        authorInfo["bannerPic"] = DEFAULT_BANNER

    authorInfo = {
        "handle": authorInfo["handle"],
        "displayName": authorInfo["displayName"],
        "bio": authorInfo["bio"],
        "profilePic": authorInfo["profilePic"],
        "bannerPic": authorInfo["bannerPic"],
    }

    return response.Response(
        {
            "followers": followers,
            "follows": follows,
            "authorInfo": authorInfo,
        }
    )
