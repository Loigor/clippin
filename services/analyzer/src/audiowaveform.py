import os

def make_waveform(file, output):
    outfile = output+'.png'
    cmd = 'audiowaveform -i'+file+' -o '+outfile+' -b 16 --colors audition -z auto'
    os.system(cmd)
    return outfile