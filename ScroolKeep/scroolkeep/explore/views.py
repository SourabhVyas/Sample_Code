from rest_framework import generics, status, response
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer


import time
import calendar
import uuid

import firebase_admin
from firebase_admin import firestore
from firebase_admin import credentials
from firebase_admin import storage

from constants.views import *


# Replace with elastic search or create a probabilistic trie (for typo independence)
@api_view(("GET",))
def suggestions(request):
    keywords = request.GET.get("keywords")
    authors_collection = get_documents(collection="authorInfo")

    authors = []
    for author in authors_collection:
        if keywords in author["handle"] or keywords in author["displayName"]:
            authors.append(
                {
                    #"id": author_ref.id,
                    "handle": author["handle"],
                    "displayName": author["displayName"],
                }
            )
    return response.Response(authors)


@api_view(("GET",))
def search(request):
    # create keywords -> noteId map 
    return response.Response('SearchMap in progress')
