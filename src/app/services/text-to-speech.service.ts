import { Injectable } from '@angular/core';
import { DropDownListModel } from '../common/interfaces/common.interface';

@Injectable({
  providedIn: 'root'
})
export class TextToSpeechService {

  //Current voice index
  private voiceIndex: number = this.setDefaultVoiceIndex()
  //voice list
  private voices: DropDownListModel[] = [];

  constructor() { }

  //text to speech
  speak(text: string): void {

    // Initialize the speech synthesis
    const synth = window.speechSynthesis;

    // Create an utterance and set the text to speak
    const utterance = new SpeechSynthesisUtterance(text);
    //speechSynthesis.speak() is no longer allowed without user activation in Google's Chrome web browser since 2018
    //so we need a hack
    window.speechSynthesis.cancel();
    // Set the voice (you may need to adjust the index)
    utterance.voice = synth.getVoices()[this.voiceIndex];

    //speak a text
    synth.speak(utterance);
  }


  // List available voices
  listVoices() {
    const voices = window.speechSynthesis.getVoices();
    this.voices = voices.map((voice, index) => ({
      label: voice.name,
      value: index,
    }));

    return this.voices;
  }

  //Set voice index
  setVoiceIndex(index: number) {
    this.voiceIndex = index;
  }

  //set default voice index
  setDefaultVoiceIndex(): number {
    return 3;
  }
}
