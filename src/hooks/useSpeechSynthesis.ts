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

    // Force English language first
    utterance.lang = 'en-US';

    // Get fresh voice list
    const availableVoices = window.speechSynthesis.getVoices();
    console.log('Available voices:', availableVoices.map(v => `${v.name} (${v.lang})`));

    // Only consider English voices (en-US, en-GB, en-AU, etc.)
    const englishVoices = availableVoices.filter(
      (voice) => voice.lang.toLowerCase().startsWith('en')
    );

    console.log('English voices:', englishVoices.map(v => `${v.name} (${v.lang})`));

    // Try multiple preferred voices in order
    const preferredVoice = 
      englishVoices.find((voice) => voice.name.toLowerCase().includes('samantha')) ||
      englishVoices.find((voice) => voice.name.toLowerCase().includes('karen')) ||
      englishVoices.find((voice) => voice.name.toLowerCase().includes('daniel')) ||
      englishVoices.find((voice) => voice.name.toLowerCase().includes('alex')) ||
      englishVoices.find((voice) => voice.name.toLowerCase().includes('microsoft') && voice.lang === 'en-US') ||
      englishVoices.find((voice) => voice.name.toLowerCase().includes('google') && voice.lang === 'en-US') ||
      englishVoices.find((voice) => voice.lang === 'en-US') ||
      englishVoices.find((voice) => voice.lang === 'en-GB') ||
      englishVoices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
      utterance.lang = preferredVoice.lang;
      console.log('✓ Using voice:', preferredVoice.name, '|', preferredVoice.lang);
    } else {
      console.warn('⚠ No English voice found! Available:', availableVoices.length, 'voices');
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
  }, [isSupported]);

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
