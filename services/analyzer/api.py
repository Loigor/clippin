import os
import json
from flask import Flask, request, json
from flask_uploads import UploadSet, AUDIO, configure_uploads
from src.aubiolib import get_file_bpm, get_spectrogram, wav_to_midi, get_waveform_plot
from src.audiowaveform import make_waveform
from src.graphs import get_pitch
import hashlib
app = Flask(__name__)

UPLOAD_FOLDER = '/usr/src/app/uploads/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

sampleIdx = 0

@app.route('/analyze', methods=['GET', 'POST'])
def analyze():
    if request.method == 'POST' and request.is_json:
        #print('FILE: ',request.form)
        # TODO: Save file to some good location

        data = request.get_json() # request.files['file']
        file = data.get('file')
        path = file.get('path')
        filename = file.get('filename')
        #tempfilename = str(sampleIdx)+'.'+ filename.rsplit('.', 1)[1]
        #tempfilelocation = os.path.join(app.config['UPLOAD_FOLDER'], tempfilename)
        #file.save(tempfilelocation)
        tempo = get_file_bpm(path)
        
        waveform = make_waveform(path, '/usr/src/app/exports/waveform-'+filename);
        filehash = hashlib.md5(path.encode('utf-8')).hexdigest()
        #get_pitch(tempfilelocation)
        # plot = get_waveform_plot(tempfilelocation)
        # midi = wav_to_midi(path, '/usr/src/app/exports/'+filename+'.mid')
        return {
            'tempo': round(tempo,3),
            'filename': filename,
            'waveform': waveform,
            'md5': filehash
        }
    
        #return  filename + ' uploaded with tempo ' + str(tempo)
    return 'Post an audio clip!'
  
@app.route('/greet')
def say_hello():
    return 'Hello from Server'