import Image from "next/image";
import { cn } from "@/lib/utils";

enum CallStatus {
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DISCONNECTED = "DISCONNECTED",
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const callStatus = CallStatus.DISCONNECTED;
  const isSpeaking = true;
  const messages = [
    "What is your name?",
    "My name is Michael Jackson, nice to meet you!",
  ];
  const lastMessage = messages[messages.length - 1];

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
            <Image
              src="/user-avatar.png"
              alt="user avatar"
              width={540}
              height={540}
              className="size-[120px] rounded-full object-cover"
            />
            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "opacity-0 transition-opacity duration-500",
                "animate-fadeIn opacity-100",
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="flex w-full justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
          <button className="btn-call relative">
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus === CallStatus.CONNECTING && "hidden",
              )}
            />
            <span>
              {callStatus === CallStatus.INACTIVE || CallStatus.DISCONNECTED
                ? "Call"
                : "..."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect">End</button>
        )}
      </div>
    </>
  );
};

export default Agent;
