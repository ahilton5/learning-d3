# https://www.d3-graph-gallery.com/network.html

import json

with open('data.json', 'r') as f:
    data = json.load(f)

network = {'nodes': [], 'links': []}

nameToId = {}

for i in range(len(data['ordered'])):
    network['nodes'].append({'id': i, 'name': data['ordered'][i]})
    nameToId[data['ordered'][i]] = i

for book1 in data['ordered']:
    for book2 in data['ordered']:
        if book1 == book2:
            continue
        if len(set(book1.lower()).intersection(book2.lower())) != 0:
            network['links'].append({'source': nameToId[book1], 'target': nameToId[book2]})

with open('network.json', 'w') as f:
    json.dump(network, f)