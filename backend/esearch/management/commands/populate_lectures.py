from api.models import Lecture, Author
from django.utils.timezone import now
import json
from tqdm import tqdm


data = json.loads(open(input('location of json file (crawled)')).read())


for l in tqdm(data):
    try:
        aut = l['authors'][0]
    except:
        aut = 'no author'

    try:
        for obj in l['videos'][0]['metadata']['attachments']:
            if obj['mimetype'] == 'video/mp4' and obj['height'] == 720:

                video = obj['src']

                author = Author.objects.get(name=aut)

                try:
                    Lecture.objects.create(title=l['title'], description=l['description'], views=l["view_ctr"], thumbnail=l['img'],
                                           video=video, audio='https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', published=now(), author=author)
                except Exception as e:
                    print('ERROR', e)
                break
    except:
        pass
