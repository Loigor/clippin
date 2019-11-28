import * as schema from './schema';

interface SampleMetadata {
  file?: File,
  analysis?: {
    tempo: number,

  }
}

export interface Sample extends schema.sample {
  tags: schema.tag[],
  packs: schema.pack[],
  metadata: SampleMetadata,
  file_uri?: string,
  waveform?: string
}

export interface Pack extends schema.pack {
  samples?: Sample[]
}

export const object = {
  PACK: <schema.pack>{
    name: ''
  }
}
