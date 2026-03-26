type QuestionnaireProps = {
  question: string;
  options: string[];
  selectedAnswer: string;
  onSelect: (answer: string) => void;
};

export default function Questionnaire({
  question,
  options,
  selectedAnswer,
  onSelect,
}: QuestionnaireProps) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {options.map((option, index) => (
          <label
            key={index}
            className="flex cursor-pointer items-center gap-2"
          >
            <input
              type="radio"
              name={question}
              value={option}
              checked={selectedAnswer === option}
              onChange={() => onSelect(option)}
              className="accent-orange-500"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}