import pymongo
import json

conn = pymongo.MongoClient('localhost', 27017)

db = conn['datagov']

# get stat abbr
states = db.states
state_name = states.find({}, {'name': 1, 'name_abbr': 1})
state_full_name = { state['name_abbr']: state['name'] for state in state_name }

# county
counties = db.counties
counties.remove({})
with open('county.geojson') as data_file:
    data = json.load(data_file)
    for county in data['features']:
        # counties.update_one({'name': county['properties']['county'], 'state': state_full_name[county['properties']['state']]}, {'$set': { 'boundary': county['geometry']}})
        counties.insert({
            'name': county['properties']['NAME'],
            'state': county['properties']['cb_2014_us_state_500k_NAME'],
            'boundary': county['geometry']
        })