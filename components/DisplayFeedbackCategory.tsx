interface CategoryScore {
  name: string;
  score: number;
  comment: string;
  index: number;
}

const DisplayFeedbackCategory = ({
  name,
  score,
  comment,
  index,
}: CategoryScore) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-row gap-2 text-lg font-semibold">
        <h4 className="">
          {index + 1}. {name}
        </h4>
        <span>({score}/100)</span>
      </div>
      <p>{comment}</p>
    </div>
  );
};

export default DisplayFeedbackCategory;
