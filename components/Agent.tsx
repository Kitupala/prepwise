"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";
import { interviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";
import { Phone, PhoneOff, PhoneOutgoing } from "lucide-react";
import { IKImage } from "imagekitio-next";

enum CallStatus {
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONNECTED = "DISCONNECTED",
}

const Agent = ({
  userName,
  userId,
  avatar,
  type,
  interviewId,
  feedbackId,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.DISCONNECTED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);

    const onError = (error: Error) => console.log("Error", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  const handleGenerateFeedback = useCallback(
    async (messages: SavedMessage[]) => {
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        toast.error("Failed to create feedback.");
        router.push("/");
      }
    },
    [interviewId, feedbackId, userId, router],
  );

  useEffect(() => {
    if (callStatus === CallStatus.DISCONNECTED) {
      if (type === "generate") {
        router.push("/");
      } else {
        (async () => {
          await handleGenerateFeedback(messages);
        })();
      }
    }
  }, [messages, callStatus, type, handleGenerateFeedback, router]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    if (type === "generate") {
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
        variableValues: {
          username: userName,
          userid: userId,
        },
      });
    } else {
      let formattedQuestions = "";

      if (questions) {
        formattedQuestions = questions
          .map((question) => `- ${question}`)
          .join("\n");
      }

      await vapi.start(interviewer, {
        variableValues: {
          questions: formattedQuestions,
        },
      });
    }
  };

  const handleDisconnect = async () => {
    setCallStatus(CallStatus.DISCONNECTED);

    vapi.stop();
  };

  const latestMessage = messages[messages.length - 1]?.content;

  const isCallInactiveOrDisconnected =
    callStatus === CallStatus.INACTIVE ||
    callStatus === CallStatus.DISCONNECTED;

  const imageKitUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;
  const imageURL = `${imageKitUrl}${avatar}`;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="vapi"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            {avatar !== null ? (
              <IKImage
                src={imageURL}
                urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!}
                alt="user avatar"
                width={540}
                height={540}
                className="size-[120px] rounded-full object-cover"
              />
            ) : (
              <Image
                src="/profile.svg"
                alt="user avatar"
                width={540}
                height={540}
                className="size-[120px] rounded-full object-cover"
              />
            )}
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={latestMessage}
              className={cn(
                "opacity-0 transition-opacity duration-500",
                "animate-fadeIn opacity-100",
              )}
            >
              {latestMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call relative" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus === CallStatus.CONNECTING && "hidden",
              )}
            />
            <span>
              {isCallInactiveOrDisconnected ? (
                <span className="flex items-center gap-3">
                  <Phone size={20} className="-ml-2" /> Call
                </span>
              ) : (
                <span className="flex items-center gap-3">
                  <PhoneOutgoing size={20} className="-ml-2" /> Connecting...
                </span>
              )}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            <span className="flex items-center gap-3">
              <PhoneOff size={20} className="-ml-2" /> End Call
            </span>
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
