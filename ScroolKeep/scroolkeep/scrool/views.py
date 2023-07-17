from rest_framework import generics, status, response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer


import time
import calendar
import uuid

from constants.views import *


@api_view(("POST",))
def getUser(request):
    user = request.data.get("user")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=user, loginId=loginId)

    if signedInCheck["status"]:
        where = [{"field": "author", "comparator": "==", "value": signedInCheck["uid"]}]
        orderBy = {"field": "createdAt", "order": "DESCENDING"}
        documents = get_documents(collection="scrools", where=where, orderBy=orderBy)

        for document_index in range(len(documents)):
            author_info = get_documents(
                collection="authorInfo", docId=documents[document_index]["author"]
            )
            documents[document_index]["author"] = author_info["handle"]
            documents[document_index]["authorDisplayName"] = author_info["displayName"]
            documents[document_index]["authorProfilePic"] = author_info["profilePic"]

        return response.Response({"documents": documents, "status": "success"})

    else:
        return response.Response(signedInCheck["error"])


@api_view(("GET",))
def getScrool(request, userHandle, scroolId):
    document = get_documents(collection="scrools", docId=scroolId)
    author = get_documents(collection="authorInfo", docId=document["author"])
    document["author"] = author["handle"]
    document["authorDisplayName"] = author["displayName"]
    document["authorProfilePic"] = author["profilePic"]

    where = [{"field": "replyTo", "comparator": "==", "value": scroolId}]
    replies = get_documents(collection="scrools", where=where)
    for document_index in range(len(replies)):
        try:
            replies_author = get_documents(
                collection="authorInfo", docId=replies[document_index]["author"]
            )

            replies[document_index]["author"] = replies_author["handle"]
            replies[document_index]["authorDisplayName"] = replies_author["displayName"]
            replies[document_index]["authorProfilePic"] = replies_author["profilePic"]
        except:
            return response.Response("Error in author handle mapping")
    return response.Response({"scrool": document, "replies": replies})


@api_view(("GET",))
def getScroolProfile(request, user):
    where = [{"field": "handle", "comparator": "==", "value": user}]
    uid = get_documents(collection="authorInfo", where=where)
    if len(uid) > 0:
        uid = uid[0]["id"]
    else:
        return response.Response("user doesn't exist")

    where = [{"field": "author", "comparator": "==", "value": uid}]
    orderBy = {"field": "createdAt", "order": "DESCENDING"}
    documents = get_documents(collection="scrools", where=where, orderBy=orderBy)
    root_scrools = []

    for document_index in range(len(documents)):
        if "replyTo" not in documents[document_index]:
            author = get_documents(
                collection="authorInfo", docId=documents[document_index]["author"]
            )
            documents[document_index]["author"] = author["handle"]
            documents[document_index]["authorDisplayName"] = author["displayName"]
            documents[document_index]["authorProfilePic"] = author["profilePic"]
            root_scrools.append(documents[document_index])

    return response.Response({"documents": root_scrools, "status": "success"})


@api_view(("POST",))
def createScrool(request):
    author = request.data.get("author")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=author, loginId=loginId)

    if signedInCheck["status"]:
        uid = signedInCheck["uid"]

        textContent = request.data.get("textContent")
        createdAt = calendar.timegm(time.gmtime())
        documentData = {
            "document": {"author": uid, "content": textContent, "createdAt": createdAt},
            "meta": {"collection": "scrools"},
        }
        replyTo = request.data.get("replyTo")
        if replyTo != None:
            documentData["document"]["replyTo"] = replyTo

        try:
            file = request.FILES["attachment"]

            author_info = get_documents(collection="authorInfo", docId=uid)
            if "mediaId" in author_info:
                destination_path = author_info["mediaId"] + "/" + uuid.uuid4().hex
            else:
                mediaId = uuid.uuid4().hex
                update_document(
                    collection="authorInfo",
                    docId=uid,
                    updateData={"mediaId": mediaId},
                )
                destination_path = mediaId + "/" + uuid.uuid4().hex

            fileData = {"file": file, "meta": {"destination_path": destination_path}}

            creation_status = create_document(
                documentData=documentData, fileData=fileData
            )
        except:
            creation_status = create_document(documentData=documentData)

        createdDocument = get_documents(
            collection="scrools", docId=creation_status["documentId"]
        )
        author = get_documents(collection="authorInfo", docId=createdDocument["author"])
        createdDocument["author"] = author["handle"]
        createdDocument["authorDisplayName"] = author["displayName"]
        createdDocument["authorProfilePic"] = author["profilePic"]

        return response.Response(createdDocument)

    else:
        return response.Response(signedInCheck["error"])


@api_view(("POST",))
def deleteScrool(request):
    author = request.data.get("author")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=author, loginId=loginId)

    if signedInCheck["status"]:
        scroolId = request.data.get("scroolId")
        uid = signedInCheck["uid"]

        document = get_documents(collection="scrools", docId=scroolId)
        author = get_documents(collection="authorInfo", docId=document["author"])
        if document["author"] == uid and author["loginId"] == loginId:
            try:
                delete_status = delete_document(collection="scrools", docId=scroolId)
                where = [
                    {"field": "scroolId", "comparator": "==", "value": scroolId},
                ]
                like_delete_status = delete_document(collection="likes", where=where)

                return response.Response(delete_status)
            except Exception as e:
                return response.Response("Error deleting scrool", e)
        else:
            return response.Response("invalid user")
    else:
        return response.Response(signedInCheck["error"])


@api_view(("POST",))
def opinionScrool(request):
    user = request.data.get("user")
    loginId = request.data.get("loginId")

    signedInCheck = signedIn(user=user, loginId=loginId)

    if signedInCheck["status"]:
        scroolId = request.data.get("scroolId")
        uid = signedInCheck["uid"]

        where = [
            {"field": "user", "comparator": "==", "value": uid},
            {"field": "scroolId", "comparator": "==", "value": scroolId},
        ]

        document = get_documents(collection="likes", where=where)
        if len(document) == 0:
            documentData = {
                "document": {"user": uid, "scroolId": scroolId},
                "meta": {"collection": "likes"},
            }
            status = create_document(documentData=documentData)
        else:
            print(document)
            status = delete_document(collection="likes", docId=document[0]["id"])
        return response.Response(status)
    else:
        return response.Response(signedInCheck["error"])


@api_view(("GET",))
def impressionStat(request):
    scroolId = request.GET.get("scroolId")
    signedInCheck = signedIn(
        user=request.GET.get("user"), loginId=request.GET.get("loginId")
    )
    likeStatus = False
    if signedInCheck["status"]:
        uid = signedInCheck["uid"]
        print(uid, scroolId)
        where = [
            {"field": "user", "comparator": "==", "value": uid},
            {"field": "scroolId", "comparator": "==", "value": scroolId},
        ]

        likeStatus = len(get_documents(collection="likes", where=where)) > 0

    where = [
        {"field": "scroolId", "comparator": "==", "value": scroolId},
    ]
    numLikes = len(get_documents(collection="likes", where=where))

    where = [
        {"field": "replyTo", "comparator": "==", "value": scroolId},
    ]
    numReplies = len(get_documents(collection="scrools", where=where))

    return response.Response(
        {"numLikes": numLikes, "numReplies": numReplies, "likeStatus": likeStatus}
    )
