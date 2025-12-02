import { supabase } from "@/integrations/supabase/client";

export type VoiceEventHandler = {
  onTranscript?: (text: string, isFinal: boolean) => void;
  onResponse?: (text: string) => void;
  onFunctionCall?: (name: string, args: any) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected') => void;
  onSpeakingChange?: (isSpeaking: boolean) => void;
};

export class RealtimeVoiceChat {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioEl: HTMLAudioElement;
  private handlers: VoiceEventHandler;
  private functionCallBuffer: { [callId: string]: string } = {};

  constructor(handlers: VoiceEventHandler) {
    this.handlers = handlers;
    this.audioEl = document.createElement("audio");
    this.audioEl.autoplay = true;
  }

  async connect(): Promise<string> {
    this.handlers.onStatusChange?.('connecting');

    try {
      // Get ephemeral token from our Edge Function
      const { data, error } = await supabase.functions.invoke("realtime-token");
      
      if (error || !data?.client_secret?.value) {
        throw new Error(error?.message || "Failed to get ephemeral token");
      }

      const EPHEMERAL_KEY = data.client_secret.value;

      // Create peer connection
      this.pc = new RTCPeerConnection();

      // Set up remote audio playback
      this.pc.ontrack = (e) => {
        this.audioEl.srcObject = e.streams[0];
        console.log("Audio track received");
      };

      // Add local audio track
      const ms = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      this.pc.addTrack(ms.getTracks()[0]);

      // Set up data channel for events
      this.dc = this.pc.createDataChannel("oai-events");
      this.dc.addEventListener("message", (e) => {
        this.handleEvent(JSON.parse(e.data));
      });

      this.dc.addEventListener("open", () => {
        console.log("Data channel opened");
        this.handlers.onStatusChange?.('connected');
      });

      this.dc.addEventListener("close", () => {
        console.log("Data channel closed");
        this.handlers.onStatusChange?.('disconnected');
      });

      // Create and set local description
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);

      // Connect to OpenAI's Realtime API
      const baseUrl = "https://api.openai.com/v1/realtime";
      const model = "gpt-4o-realtime-preview-2024-12-17";
      
      const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
          Authorization: `Bearer ${EPHEMERAL_KEY}`,
          "Content-Type": "application/sdp"
        },
      });

      if (!sdpResponse.ok) {
        throw new Error(`Failed to connect to OpenAI: ${sdpResponse.status}`);
      }

      const answer: RTCSessionDescriptionInit = {
        type: "answer",
        sdp: await sdpResponse.text(),
      };
      
      await this.pc.setRemoteDescription(answer);
      console.log("WebRTC connection established");

      return data.id || "connected";
    } catch (error) {
      console.error("Error connecting:", error);
      this.handlers.onError?.(error instanceof Error ? error : new Error(String(error)));
      this.handlers.onStatusChange?.('disconnected');
      throw error;
    }
  }

  private handleEvent(event: any) {
    console.log("Received event:", event.type, event);

    switch (event.type) {
      case 'session.created':
        console.log("Session created");
        break;

      case 'conversation.item.input_audio_transcription.completed':
        // User's speech transcribed
        this.handlers.onTranscript?.(event.transcript, true);
        break;

      case 'response.audio_transcript.delta':
        // Assistant's response text (streaming)
        this.handlers.onResponse?.(event.delta);
        break;

      case 'response.audio.delta':
        // Assistant is speaking
        this.handlers.onSpeakingChange?.(true);
        break;

      case 'response.audio.done':
        // Assistant finished speaking
        this.handlers.onSpeakingChange?.(false);
        break;

      case 'response.function_call_arguments.delta':
        // Accumulate function call arguments
        if (!this.functionCallBuffer[event.call_id]) {
          this.functionCallBuffer[event.call_id] = '';
        }
        this.functionCallBuffer[event.call_id] += event.delta;
        break;

      case 'response.function_call_arguments.done':
        // Function call complete
        try {
          const args = JSON.parse(event.arguments);
          console.log("Function call:", event.name, args);
          this.handlers.onFunctionCall?.(event.name || 'confirm_reservation', args);
          
          // Send function result back
          this.sendFunctionResult(event.call_id, event.item_id, { success: true });
        } catch (e) {
          console.error("Error parsing function args:", e);
        }
        delete this.functionCallBuffer[event.call_id];
        break;

      case 'error':
        console.error("Realtime API error:", event.error);
        this.handlers.onError?.(new Error(event.error?.message || 'Unknown error'));
        break;
    }
  }

  private sendFunctionResult(callId: string, itemId: string, result: any) {
    if (!this.dc || this.dc.readyState !== 'open') return;

    // Send function output
    this.dc.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'function_call_output',
        call_id: callId,
        output: JSON.stringify(result)
      }
    }));

    // Request response continuation
    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  sendTextMessage(text: string) {
    if (!this.dc || this.dc.readyState !== 'open') {
      throw new Error('Not connected');
    }

    this.dc.send(JSON.stringify({
      type: 'conversation.item.create',
      item: {
        type: 'message',
        role: 'user',
        content: [{ type: 'input_text', text }]
      }
    }));

    this.dc.send(JSON.stringify({ type: 'response.create' }));
  }

  disconnect() {
    if (this.dc) {
      this.dc.close();
      this.dc = null;
    }
    if (this.pc) {
      this.pc.close();
      this.pc = null;
    }
    this.audioEl.srcObject = null;
    this.handlers.onStatusChange?.('disconnected');
  }

  isConnected(): boolean {
    return this.dc?.readyState === 'open';
  }
}
