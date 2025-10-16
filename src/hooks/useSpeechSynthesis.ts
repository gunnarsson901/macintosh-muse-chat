import { useState, useEffect, useCallback, useRef } from 'react';

export const useSpeechSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setIsSupported(true);

      const loadVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.cancel();
      };
    } else {
      setIsSupported(false);
      console.warn('Speech Synthesis not supported in this browser');
    }
  }, []);

  const speak = useCallback((text: string, rate: number = 1.0, pitch: number = 1.0) => {
    if (!isSupported) {
      console.warn('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Filter for English voices only
    const englishVoices = voices.filter(
      (voice) => voice.lang.startsWith('en-')
    );

    // Priority list for English voices
    const preferredVoice = 
      englishVoices.find((voice) => voice.name.includes('Samantha')) ||
      englishVoices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Karen')) ||
      englishVoices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Daniel')) ||
      englishVoices.find((voice) => voice.lang === 'en-GB' && voice.name.includes('Daniel')) ||
      englishVoices.find((voice) => voice.lang === 'en-US') ||
      englishVoices.find((voice) => voice.lang === 'en-GB') ||
      englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
      console.log('Selected voice:', preferredVoice.name, preferredVoice.lang);
    } else {
      // Force English language even if no English voice found
      utterance.lang = 'en-US';
      console.warn('No English voice found, using default with en-US language');
    }

    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  }, [isSupported, voices]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    isSupported,
    voices,
  };
};
