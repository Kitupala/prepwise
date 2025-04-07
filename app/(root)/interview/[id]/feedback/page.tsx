import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import dayjs from "dayjs";
import DisplayFeedbackCategory from "@/components/DisplayFeedbackCategory";
import Link from "next/link";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id ?? "",
  });

  const formattedDate = dayjs(feedback?.createdAt).format(
    "MMM D, YYYY - h:mm A",
  );

  return (
    <section className="section-feedback">
      <h2 className="text-center text-4xl font-semibold">
        Feedback on the Interview — <br />
        <span className="capitalize">{interview.role} Interview</span>
      </h2>
      <div className="flex flex-col justify-center gap-4 sm:flex-row sm:gap-8">
        <div className="flex flex-row items-center gap-2">
          <Image src="/star.svg" alt="star" width={22} height={22} />
          <p>Overall Impression: {feedback?.totalScore}/100</p>
        </div>

        <div className="flex flex-row items-center gap-2">
          <Image src="/calendar.svg" alt="calendar" width={22} height={22} />
          <p>{formattedDate}</p>
        </div>
      </div>
      <hr />
      <p>{feedback?.finalAssessment}</p>

      <h3 className="text-3xl">Breakdown of Evaluation:</h3>
      {feedback?.categoryScores.map((score, index) => (
        <DisplayFeedbackCategory
          key={index}
          index={index}
          name={score.name}
          score={score.score}
          comment={score.comment}
        />
      ))}

      <div className="flex flex-col gap-3">
        <h3>Strengths</h3>
        {feedback?.strengths.length ? (
          <ul className="list-disc space-y-1 pl-8">
            {feedback?.strengths.map((strength, index) => (
              <li key={index}>{strength}</li>
            ))}
          </ul>
        ) : (
          <p>No strengths to mention.</p>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3>Areas for Improvement</h3>
        <ul className="list-disc space-y-1 pl-8">
          {feedback?.areasForImprovement?.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>

      <div className="buttons">
        <Button className="btn-secondary flex-1">
          <Link href="/">Back to dashboard</Link>
        </Button>
        <Button className="btn-primary flex-1">
          <Link href={`/interview/${id}`}>Retake interview</Link>
        </Button>
      </div>
    </section>
  );
};

export default Page;
