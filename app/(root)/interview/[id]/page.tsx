import { getInterviewById } from "@/lib/actions/general.action";
import { redirect } from "next/navigation";
import Image from "next/image";
import { getRandomInterviewCover } from "@/lib/utils";
import DisplayTechIcons from "@/components/DisplayTechIcons";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";

const Page = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  return (
    <>
      <div className="flex flex-row justify-between gap-4">
        <div className="flex flex-row items-center gap-4 max-sm:flex-col">
          <div className="flex flex-row items-center gap-4">
            <Image
              src={getRandomInterviewCover()}
              alt="cover image"
              width={40}
              height={40}
              className="size-[40px] rounded-full object-cover"
            />
            <h3 className="capitalize">{interview.role} Interview</h3>
          </div>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>
        <p className="bg-dark-200 h-fit rounded-lg px-4 py-2 capitalize">
          {interview.type}
        </p>
      </div>

      <Agent
        userName={user?.name || ""}
        userId={user?.id}
        type="interview"
        interviewId={id}
        questions={interview.questions}
      />
    </>
  );
};

export default Page;
