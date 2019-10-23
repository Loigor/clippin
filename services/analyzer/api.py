import os
from flask import Flask, request
from flask_uploads import UploadSet, AUDIO, configure_uploads
from lib.aubio import get_file_bpm
from lib.audiowaveform import make_waveform
app = Flask(__name__)

UPLOAD_FOLDER = '/usr/src/app/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


sampleIdx = 0

@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    if request.method == 'POST' and 'file' in request.files:
        global sampleIdx
        sampleIdx += 1

        # TODO: Save file to some good location

        file = request.files['file']
        filename = file.filename
        tempfilename = str(sampleIdx)+'.'+ filename.rsplit('.', 1)[1]
        tempfilelocation = os.path.join(app.config['UPLOAD_FOLDER'], tempfilename)
        file.save(tempfilelocation)
        tempo = get_file_bpm(tempfilelocation)
        sampleIdx -= 1
        return  filename + ' uploaded with tempo ' + str(tempo)
    return 'Post an audio clip!'
  
@app.route('/greet')
def say_hello():
    return 'Hello from Server'