import requests


params = {'client_id':'f9e2c4c64ae050b31c3ed8d89b6ec14c'}
r = requests.get('https://api.readmill.com/v2/users/hand/readings', params=params)
print r.json()