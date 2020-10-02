from api.models import Lecture, Author
from django.utils.timezone import now
import json


data = json.loads(open(
    "<>PATH TO JSON<>").read())

for l in data[5:100]:
    author = Author.objects.get(views=777)
    try:
        Lecture.objects.create(title=l['title'], description=l['description'], views=l["view_ctr"], thumbnail=l['img'], video=l['videos']
                               [0]['metadata']['attachments'][-1]['src'], audio='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', published=now(), author=author)
    except Exception as e:
        print('ERROR', e)
