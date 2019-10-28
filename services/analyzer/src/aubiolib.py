import sys, os.path
from aubio import tempo, source, pvoc, float_type, notes
from mido import Message, MetaMessage, MidiFile, MidiTrack, second2tick, bpm2tempo
from numpy import median, diff, zeros, log10, vstack, hstack
import matplotlib.pyplot as plt

def get_file_bpm(path, params=None):
    """ Calculate the beats per minute (bpm) of a given file.
        path: path to the file
        param: dictionary of parameters
    """
    if params is None:
        params = {}
    # default:
    samplerate, win_s, hop_s = 44100, 1024, 512
    if 'mode' in params:
        if params.mode in ['super-fast']:
            # super fast
            samplerate, win_s, hop_s = 4000, 128, 64
        elif params.mode in ['fast']:
            # fast
            samplerate, win_s, hop_s = 8000, 512, 128
        elif params.mode in ['default']:
            pass
        else:
            raise ValueError("unknown mode {:s}".format(params.mode))
    # manual settings
    if 'samplerate' in params:
        samplerate = params.samplerate
    if 'win_s' in params:
        win_s = params.win_s
    if 'hop_s' in params:
        hop_s = params.hop_s

    s = source(path, samplerate, hop_s)
    samplerate = s.samplerate
    o = tempo("specdiff", win_s, hop_s, samplerate)
    # List of beats, in samples
    beats = []
    # Total number of frames read
    total_frames = 0

    while True:
        samples, read = s()
        is_beat = o(samples)
        if is_beat:
            this_beat = o.get_last_s()
            beats.append(this_beat)
            #if o.get_confidence() > .2 and len(beats) > 2.:
            #    break
        total_frames += read
        if read < hop_s:
            break

    def beats_to_bpm(beats, path):
        # if enough beats are found, convert to periods then to bpm
        if len(beats) > 1:
            if len(beats) < 4:
                print("few beats found in {:s}".format(path))
            bpms = 60./diff(beats)
            return median(bpms)
        else:
            print("not enough beats found in {:s}".format(path))
            return 0

    return beats_to_bpm(beats, path)





def get_spectrogram(filename, samplerate = 0):
    win_s = 512                                        # fft window size
    hop_s = win_s // 2                                 # hop size
    fft_s = win_s // 2 + 1                             # spectrum bins

    a = source(filename, samplerate, hop_s)            # source file
    if samplerate == 0: samplerate = a.samplerate
    pv = pvoc(win_s, hop_s)                            # phase vocoder
    specgram = zeros([0, fft_s], dtype=float_type)     # numpy array to store spectrogram

    # analysis
    while True:
        samples, read = a()                              # read file
        specgram = vstack((specgram,pv(samples).norm))   # store new norm vector
        if read < a.hop_size: break

    # plotting
    fig = plt.imshow(log10(specgram.T + .001), origin = 'bottom', aspect = 'auto', cmap=plt.cm.gray_r)
    ax = fig.axes
    ax.axis([0, len(specgram), 0, len(specgram[0])])
    # show axes in Hz and seconds
    time_step = hop_s / float(samplerate)
    total_time = len(specgram) * time_step
    outstr = "total time: %0.2fs" % total_time
    print(outstr + ", samplerate: %.2fkHz" % (samplerate / 1000.))
    n_xticks = 10
    n_yticks = 10

    def get_rounded_ticks( top_pos, step, n_ticks ):
        top_label = top_pos * step
        # get the first label
        ticks_first_label = top_pos * step / n_ticks
        # round to the closest .1
        ticks_first_label = round ( ticks_first_label * 10. ) / 10.
        # compute all labels from the first rounded one
        ticks_labels = [ ticks_first_label * n for n in range(n_ticks) ] + [ top_label ]
        # get the corresponding positions
        ticks_positions = [ ticks_labels[n] / step for n in range(n_ticks) ] + [ top_pos ]
        # convert to string
        ticks_labels = [  "%.1f" % x for x in ticks_labels ]
        # return position, label tuple to use with x/yticks
        return ticks_positions, ticks_labels
  
    # apply to the axis
    x_ticks, x_labels = get_rounded_ticks ( len(specgram), time_step, n_xticks )
    y_ticks, y_labels = get_rounded_ticks ( len(specgram[0]), (samplerate / 1000. / 2.) / len(specgram[0]), n_yticks )
    ax.set_xticks( x_ticks )
    ax.set_yticks ( y_ticks )
    ax.set_xticklabels( x_labels )
    ax.set_yticklabels ( y_labels )
    ax.set_ylabel('Frequency (kHz)')
    ax.set_xlabel('Time (s)')
    ax.set_title(os.path.basename(filename))
    for item in ([ax.title, ax.xaxis.label, ax.yaxis.label] +
            ax.get_xticklabels() + ax.get_yticklabels()):
        item.set_fontsize('x-small')

    # save the image
    outimage = os.path.basename(filename) + '.png'
    plt.savefig(outimage)
    
    return fig




def wav_to_midi(filename, midioutput):

    downsample = 1
    samplerate = 44100 // downsample
    if len( sys.argv ) > 3: samplerate = int(sys.argv[3])

    win_s = 512 // downsample # fft size
    hop_s = 256 // downsample # hop size

    s = source(filename, samplerate, hop_s)
    samplerate = s.samplerate

    tolerance = 0.8

    notes_o = notes("default", win_s, hop_s, samplerate)

    print("%8s" % "time","[ start","vel","last ]")

    # create a midi file
    mid = MidiFile()
    track = MidiTrack()
    mid.tracks.append(track)

    ticks_per_beat = mid.ticks_per_beat # default: 480
    bpm = 120 # default midi tempo

    tempo = bpm2tempo(bpm)
    track.append(MetaMessage('set_tempo', tempo=tempo))
    track.append(MetaMessage('time_signature', numerator=4, denominator=4))

    def frames2tick(frames, samplerate=samplerate):
        sec = frames / float(samplerate)
        return int(second2tick(sec, ticks_per_beat, tempo))

    last_time = 0

    # total number of frames read
    total_frames = 0
    while True:
        samples, read = s()
        new_note = notes_o(samples)
        if (new_note[0] != 0):
            note_str = ' '.join(["%.2f" % i for i in new_note])
            print("%.6f" % (total_frames/float(samplerate)), new_note)
            delta = frames2tick(total_frames) - last_time
            if new_note[2] > 0:
                track.append(Message('note_off', note=int(new_note[2]),
                    velocity=127, time=delta)
                    )
            track.append(Message('note_on',
                note=int(new_note[0]),
                velocity=int(new_note[1]),
                time=delta)
                )
            last_time = frames2tick(total_frames)
        total_frames += read
        if read < hop_s: break

    mid.save(midioutput)
    #return mid.format_as_string()
    




def get_waveform_plot(filename, samplerate = 0, block_size = 4096, ax = None, downsample = 2**4):
    import matplotlib.pyplot as plt
    if not ax:
        fig = plt.figure()
        ax = fig.add_subplot(111)
    hop_s = block_size

    allsamples_max = zeros(0,)
    downsample = downsample  # to plot n samples / hop_s

    a = source(filename, samplerate, hop_s)            # source file
    if samplerate == 0: samplerate = a.samplerate

    total_frames = 0
    while True:
        samples, read = a()
        # keep some data to plot it later
        new_maxes = (abs(samples.reshape(hop_s//downsample, downsample))).max(axis=0)
        allsamples_max = hstack([allsamples_max, new_maxes])
        total_frames += read
        if read < hop_s: break
    allsamples_max = (allsamples_max > 0) * allsamples_max
    allsamples_max_times = [ ( float (t) / downsample ) * hop_s for t in range(len(allsamples_max)) ]

    ax.plot(allsamples_max_times,  allsamples_max, '-b')
    ax.plot(allsamples_max_times, -allsamples_max, '-b')
    ax.axis(xmin = allsamples_max_times[0], xmax = allsamples_max_times[-1])

    set_xlabels_sample2time(ax, allsamples_max_times[-1], samplerate)

    outimage = os.path.basename(filename) + '.png'
    plt.savefig(outimage)

    return ax

def set_xlabels_sample2time(ax, latest_sample, samplerate):
    ax.axis(xmin = 0, xmax = latest_sample)
    if latest_sample / float(samplerate) > 60:
        ax.set_xlabel('time (mm:ss)')
        ax.set_xticklabels([ "%02d:%02d" % (t/float(samplerate)/60, (t/float(samplerate))%60) for t in ax.get_xticks()[:-1]], rotation = 50)
    else:
        ax.set_xlabel('time (ss.mm)')
        ax.set_xticklabels([ "%02d.%02d" % (t/float(samplerate), 100*((t/float(samplerate))%1) ) for t in ax.get_xticks()[:-1]], rotation = 50)
