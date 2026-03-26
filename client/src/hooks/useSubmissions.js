import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Connect to your Express API Gateway
const socket = io('http://localhost:3000');

export const useSubmission = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = async (code, language) => {
    setIsRunning(true);
    setOutput('Compiling and running...');

    try {
      // 1. Request a job from the API
      const response = await axios.post(
        'http://localhost:3000/api/submissions/run',
        {
          code,
          language,
        }
      );

      const { jobId } = response.data;

      // 2. Join the private room for this job
      socket.emit('join-submission', jobId);

      // 3. Listen for the result (once)
      socket.once('verdict', (result) => {
        if (result.success) {
          setOutput(result.stdout || 'Success (No output)');
        } else {
          setOutput(result.stderr || 'An error occurred');
        }
        setIsRunning(false);
      });
    } catch (error) {
      setOutput('Error: Could not connect to the execution server.');
      setIsRunning(false);
    }
  };

  return { runCode, output, isRunning };
};
