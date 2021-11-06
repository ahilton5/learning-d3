from collections import Counter
import json

with open('data.json', 'r') as f:
    data = json.load(f)

with open('letters.csv', 'w') as f:
    print('letter,count', file=f)
    c = Counter(''.join(data['ordered']).lower().replace(' ',''))
    for l in c:
        print(l,c[l],sep=',', file=f)