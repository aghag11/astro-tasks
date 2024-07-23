// src/components/VoiceDictation.js
import React, { useState } from 'react';

const VoiceDictation = ({ onTranscript }) => {
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return <p>Sorry, your browser doesn't support Speech Recognition.</p>;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  const startListening = () => {
    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setListening(false);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const stopListening = () => {
    recognition.stop();
    setListening(false);
  };

  return (
    <div>
      <button onClick={listening ? stopListening : startListening}>
        {listening ? 'Stop' : 'Start'} Listening
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default VoiceDictation;