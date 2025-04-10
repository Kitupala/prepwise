import dayjs from "dayjs";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getFeedbackByInterviewId } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";

const InterviewCard = async ({
  id: interviewId,
  userId,
  role,
  type,
  techstack,
  createdAt,
}: InterviewCardProps) => {
  const user = await getCurrentUser();
  const feedback =
    userId && userId === user?.id && interviewId
      ? await getFeedbackByInterviewId({ interviewId, userId })
      : null;
  const normalizedType = /mix/gi.test(type) ? "Mixed" : type;
  const formattedDate = dayjs(
    feedback?.createdAt || createdAt || Date.now(),
  ).format("MMM D, YYYY");

  return (
    <div className="card-border min-h-96 w-[360px] max-sm:w-full">
      <div className="card-interview">
        <div>
          <div className="bg-light-600 absolute top-0 right-0 w-fit rounded-bl-lg px-4 py-2">
            <p className="badge-text">{normalizedType}</p>
          </div>

          <Image
            src={getRandomInterviewCover()}
            alt="cover-image"
            width={90}
            height={90}
            className="size-[80px] rounded-full object-cover"
          />

          <h3 className="mt-5 capitalize">{role} Interview</h3>

          <div className="mt-3 flex flex-row gap-5">
            <div className="flex flex-row gap-2">
              <Image
                src="/calendar.svg"
                alt="calendar"
                width={22}
                height={22}
              />
              <p>{formattedDate}</p>
            </div>

            <div className="flex flex-row items-center gap-2">
              <Image src="/star.svg" alt="star" width={22} height={22} />
              <p>{feedback?.totalScore || "---"}/100</p>
            </div>
          </div>

          <p className="mt-5 line-clamp-2">
            {feedback?.finalAssessment ||
              "You haven't taken the interview yet. Take it now to improve your skills!"}
          </p>
        </div>

        <div className="flex flex-row justify-between">
          <DisplayTechIcons techStack={techstack} />
          <Button className="btn-primary">
            <Link
              href={
                feedback
                  ? `/interview/${interviewId}/feedback`
                  : `/interview/${interviewId}`
              }
            >
              {feedback ? "Check Feedback" : "Take Interview"}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewCard;
