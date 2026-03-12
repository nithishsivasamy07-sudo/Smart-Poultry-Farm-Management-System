import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFarmData } from "@/contexts/FarmDataContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AIChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi there! I am your AI Assistant. How can I help you manage your poultry farm today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const farmData = useFarmData();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // Create context summary so the AI knows about the farm data
      const totalChickens = farmData.batches.reduce((sum, b) => sum + b.quantity, 0); // Active batches
      const totalEggs = farmData.eggRecords.reduce((sum, e) => sum + e.numberOfEggs, 0);
      const remainingFeed = farmData.feedRecords.filter(f => f.type === "stock").reduce((s, f) => s + f.quantity, 0)
                            - farmData.feedRecords.filter(f => f.type === "consumption").reduce((s, f) => s + f.quantity, 0);

      const systemContextMsg = {
        role: "system",
        content: `You are an expert AI assistant for a poultry farm app. Current Farm state: Total active chickens: ${totalChickens}, Total eggs produced: ${totalEggs}, Remaining Feed: ${remainingFeed} kg.`
      };

      // In a real integration, this calls the local backend server (e.g. http://localhost:3001/api/chat)
      // For immediate preview without the backend running, we conditionally mock it if it fails:
      
      let replyText = "";
      try {
        const res = await fetch("http://localhost:3001/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [systemContextMsg, ...messages, userMsg] })
        });
        if (res.ok) {
           const data = await res.json();
           replyText = data.reply;
        } else {
           throw new Error("Backend unavailable");
        }
      } catch (err) {
        replyText = "I'm currently running in isolated frontend mode! To get real AI responses, please start the companion Node.js backend (`node server/ai-api.js`).";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "assistant", content: "An error occurred while connecting." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50 p-0"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-card border border-border rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-3 sm:p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold text-sm">AI Farm Assistant</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-primary-foreground hover:bg-primary/90 hover:text-white rounded-full">
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Chat Area */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="flex flex-col gap-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-muted text-foreground rounded-tl-sm"}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="self-start flex gap-2 max-w-[85%]">
                   <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                     <Bot className="w-4 h-4" />
                   </div>
                   <div className="p-3 rounded-xl bg-muted text-foreground rounded-tl-sm text-sm flex gap-1 items-center">
                     <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce"></span>
                     <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{animationDelay: "0.2s"}}></span>
                     <span className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{animationDelay: "0.4s"}}></span>
                   </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card shrink-0">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <Input 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about your farm..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={!input.trim() || isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
