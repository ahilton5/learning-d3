# 1: 'blue', // susceptible
# 2: 'yellow', // exposed
# 3: 'red', // infected
# 4: 'green' // recovered

import numpy as np
import json

with open('network.json', 'r') as f:
    data = json.load(f)

neighbors = {}

for n in data['nodes']:
    neighbors[n['id']] = set()

for edge in data['links']:
    neighbors[edge['source']].add((edge['target'], edge['value']))
    neighbors[edge['target']].add((edge['source'], edge['value']))

ndays = 10
tInc = 3
tRec = 5

def runSim(starter : str):

    states = {}
    for n in data['nodes']:
        states[n['id']] = {'state': n['group'], 't': 0}

    states[starter]['state'] = 3

    output[starter] = {'nodes': [], 'links': data['links']}
    for n in data['nodes']:
        output[starter]['nodes'].append({'id': n['id'], 'groups': [states[n['id']]['state']]})

    for day in range(ndays):
        for n in data['nodes']:
            if states[n['id']]['state'] == 3:
                # They're infectious and can spread
                # Update time in state
                states[n['id']]['t'] += 1
                if states[n['id']]['t'] >= tRec:
                    # Yay, they've recovered
                    states[n['id']]['state'] = 4
                    states[n['id']]['t'] = 0
                else:
                    # try to infect neighbors
                    for neighbor in neighbors[n['id']]:
                        if states[neighbor[0]]['state'] == 1:
                            # This neighbor could get sick
                            infected = np.random.binomial(1, neighbor[1]/32)
                            if infected:
                                states[neighbor[0]]['state'] = 2
                                states[neighbor[0]]['t'] = 0
            elif states[n['id']]['state'] == 2:
                # They're exposed but don't spread yet
                # Update time in state
                states[n['id']]['t'] += 1
                if states[n['id']]['t'] >= tInc:
                    states[n['id']]['state'] = 3
                    states[n['id']]['t'] = 0
            else:
                # Ether they've recovered and nothing happens or they're still susceptible
                # Nothing to do here either way.
                states[n['id']]['t'] += 1

        # Add today's states to the output
        for i in range(len(output[starter]['nodes'])):
            output[starter]['nodes'][i]['groups'].append(states[output[starter]['nodes'][i]['id']]['state'])
        
output = {}
runSim('Valjean')
runSim('Gribier')

with open('sim.json', 'w') as f:
    json.dump(output, f)