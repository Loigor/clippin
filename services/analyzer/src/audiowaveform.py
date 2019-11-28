import os
import sys
import json

def make_waveform(file, output):
    # make dat file
    datfile = output+'.dat'
    cmd = 'audiowaveform -i '+file+' -o '+datfile+' -b 8'
    os.system(cmd)
    # convert dat to json
    jsonfile = output+'.json'
    cmd = 'audiowaveform -i '+datfile+' -o '+jsonfile 
    os.system(cmd)
    # normalize
    scaled_json = scale_json(jsonfile)
    return scaled_json


def scale_json(filename): 
  with open(filename, "r") as f:
      file_content = f.read()

  json_content = json.loads(file_content)
  data = json_content["data"]
  # number of decimals to use when rounding the peak value
  digits = 2

  max_val = float(max(data))
  new_data = []
  for x in data:
      new_data.append(round(x / max_val, digits))

  json_content["data"] = new_data
  file_content = json.dumps(json_content)

  with open(filename, "w") as f:
      f.write(file_content)
  return file_content