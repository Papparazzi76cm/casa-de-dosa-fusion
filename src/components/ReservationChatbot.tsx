import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2, CheckCircle, Mic, MicOff, Volume2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RealtimeVoiceChat } from "@/utils/RealtimeVoice";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type ChatMode = "text" | "voice";

const ReservationChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de Casa de Dosa. ¿Te gustaría hacer una reserva? Puedo ayudarte con todo el proceso. 🍽️",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [mode, setMode] = useState<ChatMode>("text");
  const [voiceStatus, setVoiceStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const voiceChatRef = useRef<RealtimeVoiceChat | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, transcript]);

  useEffect(() => {
    return () => {
      voiceChatRef.current?.disconnect();
    };
  }, []);

  const processReservation = async (reservationData: any) => {
    try {
      const response = await supabase.functions.invoke("send-reservation-email", {
        body: {
          ...reservationData,
          guests: String(reservationData.guests),
        },
      });

      if (response.error) {
        throw new Error(response.error.message || "Error al procesar la reserva");
      }

      setReservationSuccess(true);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "¡Tu reserva ha sido confirmada! Recibirás un email de confirmación en breve. ¡Gracias por elegir Casa de Dosa! 🎉"
      }]);
      return true;
    } catch (error) {
      console.error("Error processing reservation:", error);
      toast({
        title: "Error",
        description: "No se pudo procesar la reserva. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
      return false;
    }
  };

  const extractReservationData = (text: string) => {
    const match = text.match(/###RESERVA_JSON###\s*([\s\S]*?)\s*###FIN_RESERVA###/);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch {
        return null;
      }
    }
    return null;
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/reservation-chatbot`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ messages: newMessages }),
        }
      );

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No se pudo leer la respuesta");

      let textBuffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === "assistant" && prev.length > messages.length) {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: "assistant", content: assistantContent }];
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      const reservationData = extractReservationData(assistantContent);
      if (reservationData) {
        const formattedData = {
          ...reservationData,
          guests: String(reservationData.guests),
        };
        const success = await processReservation(formattedData);
        if (success) {
          const cleanContent = assistantContent
            .replace(/###RESERVA_JSON###[\s\S]*?###FIN_RESERVA###/g, "")
            .trim();
          
          const successMessage = cleanContent || "¡Tu reserva ha sido confirmada! Recibirás un email de confirmación en breve. ¡Gracias por elegir Casa de Dosa! 🎉";
          
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: successMessage },
          ]);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, ha ocurrido un error. Por favor, inténtalo de nuevo o llámanos al 983 64 23 92.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startVoiceMode = async () => {
    setMode("voice");
    setVoiceStatus('connecting');
    
    try {
      voiceChatRef.current = new RealtimeVoiceChat({
        onStatusChange: (status) => {
          setVoiceStatus(status);
          if (status === 'connected') {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "🎤 Modo voz activado. ¡Habla cuando quieras! Te escucho..."
            }]);
          }
        },
        onSpeakingChange: (speaking) => {
          setIsSpeaking(speaking);
        },
        onTranscript: (text, isFinal) => {
          if (isFinal) {
            setMessages(prev => [...prev, { role: "user", content: text }]);
            setTranscript("");
          } else {
            setTranscript(text);
          }
        },
        onResponse: (text) => {
          setMessages(prev => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && !last.content.includes("🎤")) {
              return prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, content: m.content + text } : m
              );
            }
            return [...prev, { role: "assistant", content: text }];
          });
        },
        onFunctionCall: async (name, args) => {
          if (name === "confirm_reservation") {
            await processReservation(args);
          }
        },
        onError: (error) => {
          console.error("Voice error:", error);
          toast({
            title: "Error de voz",
            description: "Hubo un problema con el asistente de voz. Intenta de nuevo.",
            variant: "destructive",
          });
          stopVoiceMode();
        },
      });

      await voiceChatRef.current.connect();
    } catch (error) {
      console.error("Error starting voice mode:", error);
      toast({
        title: "Error",
        description: "No se pudo activar el modo voz. Verifica los permisos del micrófono.",
        variant: "destructive",
      });
      setMode("text");
      setVoiceStatus('disconnected');
    }
  };

  const stopVoiceMode = () => {
    voiceChatRef.current?.disconnect();
    voiceChatRef.current = null;
    setMode("text");
    setVoiceStatus('disconnected');
    setIsSpeaking(false);
    setTranscript("");
  };

  const resetChat = () => {
    stopVoiceMode();
    setMessages([
      {
        role: "assistant",
        content: "¡Hola! Soy el asistente de Casa de Dosa. ¿Te gustaría hacer una reserva? Puedo ayudarte con todo el proceso. 🍽️",
      },
    ]);
    setReservationSuccess(false);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-golden hover:bg-golden-dark text-blue-grey-dark shadow-lg transition-all duration-300 ${
          isOpen ? "scale-0" : "scale-100"
        }`}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>

      {/* Chat Window */}
      <Card
        className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] shadow-2xl transition-all duration-300 border-golden/20 ${
          isOpen ? "scale-100 opacity-100" : "scale-0 opacity-0"
        }`}
      >
        <CardHeader className="bg-gradient-hero text-white rounded-t-lg p-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-display flex items-center gap-2">
              {mode === "voice" && voiceStatus === 'connected' ? (
                <>
                  <Volume2 className={`h-5 w-5 text-golden ${isSpeaking ? 'animate-pulse' : ''}`} />
                  Modo Voz
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5 text-golden" />
                  Asistente de Reservas
                </>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/10 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[350px] p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                      message.role === "user"
                        ? "bg-golden text-blue-grey-dark"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {/* Live transcript while speaking */}
              {transcript && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-golden/50 text-blue-grey-dark">
                    <p className="text-sm whitespace-pre-wrap italic">{transcript}...</p>
                  </div>
                </div>
              )}
              
              {isLoading && messages[messages.length - 1]?.role === "user" && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-4 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
              
              {voiceStatus === 'connecting' && (
                <div className="flex justify-center">
                  <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Conectando modo voz...</span>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {reservationSuccess ? (
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2 text-green-600 mb-3">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">¡Reserva completada!</span>
              </div>
              <Button onClick={resetChat} variant="outline" className="w-full">
                Nueva reserva
              </Button>
            </div>
          ) : (
            <div className="p-4 border-t border-border space-y-3">
              {/* Mode toggle */}
              <div className="flex justify-center gap-2">
                <Button
                  variant={mode === "text" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (mode === "voice") stopVoiceMode();
                    setMode("text");
                  }}
                  className={mode === "text" ? "bg-golden hover:bg-golden-dark text-blue-grey-dark" : ""}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Texto
                </Button>
                <Button
                  variant={mode === "voice" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    if (mode === "text") startVoiceMode();
                  }}
                  disabled={voiceStatus === 'connecting'}
                  className={mode === "voice" && voiceStatus === 'connected' ? "bg-golden hover:bg-golden-dark text-blue-grey-dark" : ""}
                >
                  {voiceStatus === 'connecting' ? (
                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  ) : mode === "voice" && voiceStatus === 'connected' ? (
                    <MicOff className="h-4 w-4 mr-1" />
                  ) : (
                    <Mic className="h-4 w-4 mr-1" />
                  )}
                  Voz
                </Button>
              </div>

              {/* Text input (shown in text mode) */}
              {mode === "text" && (
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="bg-golden hover:bg-golden-dark text-blue-grey-dark"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Voice indicator (shown in voice mode) */}
              {mode === "voice" && voiceStatus === 'connected' && (
                <div className="text-center text-sm text-muted-foreground">
                  {isSpeaking ? (
                    <div className="flex items-center justify-center gap-2">
                      <Volume2 className="h-4 w-4 animate-pulse text-golden" />
                      <span>El asistente está hablando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Mic className="h-4 w-4 text-green-500 animate-pulse" />
                      <span>Te escucho, habla cuando quieras</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ReservationChatbot;
