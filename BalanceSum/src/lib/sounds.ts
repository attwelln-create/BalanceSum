
'use client';

import * as Tone from 'tone';

let synth: Tone.PolySynth | null = null;
let initialized = false;

const init = async () => {
  if (initialized) return;
  await Tone.start();
  synth = new Tone.PolySynth(Tone.Synth).toDestination();
  initialized = true;
};

export const playSuccessSound = async () => {
  await init();
  if (synth) {
    synth.triggerAttackRelease(['C4', 'E4', 'G4', 'C5'], '8n');
  }
};

export const playErrorSound = async () => {
  await init();
  if (synth) {
    synth.triggerAttackRelease(['C3', 'Eb3'], '4n');
  }
};

export const playPopSound = async () => {
  await init();
  if (synth) {
    synth.triggerAttackRelease('G5', '32n');
  }
};
