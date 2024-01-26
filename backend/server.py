from flask import Flask
from flask_cors import CORS
import datetime
 
x = datetime.datetime.now()
 
app = Flask(__name__)
CORS(app)

 

@app.route('/message')
def get_message():
 
    return {
        "message": "A message from CS361"
        }
 
if __name__ == '__main__':
    app.run(debug=True)