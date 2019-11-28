import _ from 'lodash';
import * as structure from '../models/structure'


export const getSampleFileInfo = (sample: structure.Sample): structure.Sample => {
  const filename = _.get(sample, 'metadata.file.filename');
  const waveform = _.get(sample, 'metadata.analysis.waveform');
  return {
    ...sample,
    file_uri: filename ? '/api/v1/files/uploads/' + filename : undefined,
    waveform: waveform ? '/api/v1/files/exports/' + waveform.split('/').pop() : undefined
  }
}