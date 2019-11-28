import os

def make_waveform(file, output):
    outfile = output+'.dat'
    cmd = 'audiowaveform -i'+file+' -o '+outfile+' -b 8'
    os.system(cmd)
    return outfile