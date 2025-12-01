import React, { useState, useEffect } from "react";
import { useRecoilValueLoadable, useSetRecoilState } from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Clock, Loader2, CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { practiceByIdSelector } from "../state/selectors/practicesSelectors";
import { submitPracticeAnswer } from "../services/practicesService";
import { toast } from "sonner";
import { practicesRefreshKeyState } from "../state/atoms/practicesAtoms";
import { useAuth } from "../hooks/useAuth";

export function PracticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const practiceId = id ? parseInt(id, 10) : 0;
  const { user, loading: authLoading } = useAuth();
  const setPracticesRefreshKey = useSetRecoilState(practicesRefreshKeyState);

  const practiceLoadable = useRecoilValueLoadable(
    practiceByIdSelector({ id: practiceId, enabled: !!user })
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Initialize from API response (userSelectedAnswer)
  useEffect(() => {
    if (practiceLoadable.state === "hasValue" && practiceLoadable.contents) {
      const practice = practiceLoadable.contents;
      // Use userSelectedAnswer from API if available
      if (
        practice.userSelectedAnswer !== null &&
        practice.userSelectedAnswer !== undefined
      ) {
        setSelectedOption(practice.userSelectedAnswer);
        setSubmitted(practice.showAnswer || false);
        setIsCorrect(practice.userIsCorrect ?? null);
        setCorrectIndex(practice.correct_answer ?? null);
        setIsRunning(!practice.showAnswer);
      }
    }
  }, [practiceLoadable.state, practiceLoadable.contents]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && !submitted && practiceLoadable.state === "hasValue") {
      interval = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, submitted, practiceLoadable.state]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "junior":
        return "bg-green-100 text-green-700 border-green-300";
      case "mid":
        return "bg-blue-100 text-blue-700 border-blue-300";
      case "senior":
        return "bg-purple-100 text-purple-700 border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const handleSubmit = async () => {
    if (selectedOption === null) {
      toast.error("Please select an answer");
      return;
    }

    try {
      setSubmitLoading(true);
      const result = await submitPracticeAnswer(practiceId, {
        selectedAnswer: selectedOption,
      });
      setIsCorrect(result.isCorrect);
      setSubmitted(true);
      setIsRunning(false);
      setCorrectIndex(result.correctAnswer);
      // Ensure practices list reflects new attempt state without manual refresh
      setPracticesRefreshKey((key) => key + 1);

      if (result.isCorrect) {
        toast.success("Correct answer! 🎉");
      } else {
        toast.error("Incorrect answer. Try again!");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to submit answer");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Wait for auth before hitting the API
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-center mb-4">
              Please log in to view this practice question.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle loading state for the practice itself
  if (practiceLoadable.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading practice...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (practiceLoadable.state === "hasError") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-red-600 text-center mb-4">
              Failed to load practice. Please try again later.
            </p>
            <Button onClick={() => navigate("/practices")} className="w-full">
              Back to Practices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const practice = practiceLoadable.contents;
  if (!practice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center mb-4">
              Practice not found.
            </p>
            <Button onClick={() => navigate("/practices")} className="w-full">
              Back to Practices
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/practices")}
            className="gap-2 mb-3 sm:mb-4 -ml-2 sm:-ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Practices</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={`${getLevelColor(practice.level)} text-xs`}
                variant="outline"
              >
                {practice.level}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {practice.language}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {practice.difficulty}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border rounded-lg">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">{formatTime(timeElapsed)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main layout similar to Coding Challenges detail */}
        <div className="grid lg:grid-cols-[2fr,1fr] gap-6">
          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{practice.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {practice.question_text}
                </p>
              </div>

              {practice.options && practice.options.length > 0 && (
                <div className="mb-6">
                  <Label className="text-lg mb-4 block">
                    Select your answer:
                  </Label>
                  <RadioGroup
                    value={
                      selectedOption !== null ? selectedOption.toString() : ""
                    }
                    onValueChange={(value) =>
                      setSelectedOption(parseInt(value, 10))
                    }
                    disabled={submitted || submitLoading}
                  >
                    {practice.options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      const effectiveCorrect =
                        correctIndex ?? practice.correct_answer ?? null;
                      const isCorrectAnswer = effectiveCorrect === index;
                      const showAnswer = submitted || practice.showAnswer;
                      // Use userSelectedAnswer from API if available, otherwise use selectedOption
                      const userAnswer =
                        practice.userSelectedAnswer ?? selectedOption;
                      const isUserAnswer = userAnswer === index;
                      const userWasCorrect =
                        practice.userIsCorrect ?? isCorrect;

                      return (
                        <div
                          key={index}
                          className={`flex items-start space-x-3 p-4 border rounded-lg mb-3 ${
                            showAnswer && isCorrectAnswer
                              ? "bg-green-50 border-green-300"
                              : showAnswer && isUserAnswer && !userWasCorrect
                              ? "bg-red-50 border-red-300"
                              : isSelected
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200"
                          }`}
                        >
                          <RadioGroupItem
                            value={index.toString()}
                            id={`option-${index}`}
                            disabled={submitted || submitLoading}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={`option-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex items-center gap-2">
                              <span>{option}</span>
                              {showAnswer && isCorrectAnswer && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                              {showAnswer &&
                                isUserAnswer &&
                                !userWasCorrect && (
                                  <XCircle className="w-5 h-5 text-red-600" />
                                )}
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>
              )}

              {(submitted || practice.showAnswer) && practice.explanation && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Explanation:</h3>
                  <p className="text-gray-700">{practice.explanation}</p>
                </div>
              )}

              <div className="flex gap-3">
                {!submitted ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={selectedOption === null || submitLoading}
                    size="lg"
                    className="gap-2"
                  >
                    {submitLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Answer"
                    )}
                  </Button>
                ) : (
                  <Button onClick={() => navigate("/practices")} size="lg">
                    Back to Practices
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sidebar: simple performance/info panel */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Attempted:</span>{" "}
                  <span>{submitted ? "Yes" : "No"}</span>
                </div>
                {submitted && (
                  <div>
                    <span className="font-medium">Result:</span>{" "}
                    <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
