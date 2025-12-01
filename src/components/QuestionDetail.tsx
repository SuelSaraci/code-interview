import React, { useState, useEffect } from "react";
import {
  useRecoilValueLoadable,
  useRecoilValue,
  useSetRecoilState,
  useSetRecoilState as useSetRecoilStateAlias,
} from "recoil";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { questionByIdSelector } from "../state/selectors/questionsSelectors";
import { useAuth } from "../hooks/useAuth";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { submitQuestionAnswer } from "../services/questionsService";
import { toast } from "sonner";
import {
  questionsRefreshKeyState,
  questionSelectionState,
} from "../state/atoms/questionsAtoms";

export function QuestionDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = id ? parseInt(id, 10) : 0;
  const { user, loading: authLoading } = useAuth();
  const storedSelection = useRecoilValue(questionSelectionState(questionId));
  const setStoredSelection = useSetRecoilState(
    questionSelectionState(questionId)
  );
  const setQuestionsRefreshKey = useSetRecoilStateAlias(
    questionsRefreshKeyState
  );

  const questionLoadable = useRecoilValueLoadable(
    questionByIdSelector({ id: questionId, enabled: !!user })
  );
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [correctIndex, setCorrectIndex] = useState<number | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Initialize from API response (userSelectedAnswer) or stored selection
  useEffect(() => {
    if (questionLoadable.state === "hasValue" && questionLoadable.contents) {
      const question = questionLoadable.contents;
      // Prefer userSelectedAnswer from API if available
      if (
        question.userSelectedAnswer !== null &&
        question.userSelectedAnswer !== undefined
      ) {
        setSelectedOption(question.userSelectedAnswer);
        setSubmitted(question.showAnswer || false);
        setIsCorrect(question.userIsCorrect ?? null);
        setCorrectIndex(question.correct_answer ?? null);
      } else if (storedSelection !== null) {
        // Fall back to stored selection from Recoil
        setSelectedOption(storedSelection);
      }
    }
  }, [questionLoadable.state, questionLoadable.contents, storedSelection]);

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

  const handleSubmitAnswer = async () => {
    if (selectedOption === null) {
      toast.error("Please select an answer");
      return;
    }

    try {
      setSubmitLoading(true);
      const result = await submitQuestionAnswer(questionId, {
        selectedAnswer: selectedOption,
      });
      setIsCorrect(result.isCorrect);
      setSubmitted(true);
      setCorrectIndex(result.correctAnswer);
      setStoredSelection(selectedOption);
      // Ensure questions list reflects new attempt state without manual refresh
      setQuestionsRefreshKey((key) => key + 1);

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

  // Wait for auth to resolve before calling the API
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

  // If not logged in, don't call the protected API — ask user to login instead
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-700 text-center mb-4">
              Please log in to view this question.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle loading state for the question itself
  if (questionLoadable.state === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading question...</p>
        </div>
      </div>
    );
  }

  // Handle error state (including free question limit)
  if (questionLoadable.state === "hasError") {
    const error: any = questionLoadable.contents;
    const status = error?.response?.status;
    const apiError = error?.response?.data?.error;
    const apiMessage = error?.response?.data?.message;

    const isFreeLimitError =
      status === 403 && apiError === "Free question limit reached";

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 space-y-4">
            <p className="text-red-600 text-center font-semibold">
              {isFreeLimitError
                ? "Free question limit reached"
                : "Failed to load question."}
            </p>
            {isFreeLimitError && (
              <p className="text-sm text-gray-700 text-center">
                {apiMessage ??
                  "You have accessed 3 free questions. Upgrade to premium for unlimited access."}
              </p>
            )}
            {!isFreeLimitError && (
              <p className="text-sm text-gray-600 text-center">
                Please try again later.
              </p>
            )}
            <div className="flex flex-col gap-2">
              <Button onClick={() => navigate("/questions")} className="w-full">
                Back to Questions
              </Button>
              {isFreeLimitError && (
                <Button
                  variant="outline"
                  onClick={() => navigate("/pricing")}
                  className="w-full"
                >
                  View Premium Pricing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const question = questionLoadable.contents;
  if (!question) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-600 text-center mb-4">
              Question not found.
            </p>
            <Button onClick={() => navigate("/questions")} className="w-full">
              Back to Questions
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
            onClick={() => navigate("/questions")}
            className="gap-2 mb-3 sm:mb-4 -ml-2 sm:-ml-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Questions</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`${getLevelColor(question.level)} text-xs`}
              variant="outline"
            >
              {question.level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.language}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {question.difficulty}
            </Badge>
            {question.is_premium && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Premium
              </Badge>
            )}
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-2xl">{question.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-4">
              <p className="text-gray-700 whitespace-pre-wrap">
                {question.description}
              </p>
            </div>

            {question.source && (
              <div className="p-3 bg-gray-50 border rounded-lg text-sm text-gray-600">
                <strong>Source:</strong> {question.source}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Your Answer Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Your Answer</CardTitle>
          </CardHeader>
          <CardContent>
            {question.options && question.options.length > 0 ? (
              <>
                <div className="mb-4">
                  <Label className="text-sm mb-2 block">
                    Select the best answer:
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
                    {question.options.map((option, index) => {
                      const isSelected = selectedOption === index;
                      const effectiveCorrect =
                        correctIndex ?? question.correct_answer ?? null;
                      const isCorrectAnswer = effectiveCorrect === index;
                      const showAnswer = submitted || question.showAnswer;
                      // Use userSelectedAnswer from API if available, otherwise use selectedOption
                      const userAnswer =
                        question.userSelectedAnswer ?? selectedOption;
                      const isUserAnswer = userAnswer === index;
                      const userWasCorrect =
                        question.userIsCorrect ?? isCorrect;

                      return (
                        <div
                          key={index}
                          className={`flex items-start space-x-3 p-4 rounded-lg border transition-colors mb-2 ${
                            showAnswer && isCorrectAnswer
                              ? "bg-green-50 border-green-300"
                              : showAnswer && isUserAnswer && !userWasCorrect
                              ? "bg-red-50 border-red-300"
                              : isSelected
                              ? "bg-blue-50 border-blue-300"
                              : "bg-white border-gray-200 hover:border-gray-300"
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
                            <div className="flex items-center gap-2 text-sm">
                              <span>{option}</span>
                              {showAnswer && isCorrectAnswer && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                              {showAnswer &&
                                isUserAnswer &&
                                !userWasCorrect && (
                                  <XCircle className="w-4 h-4 text-red-600" />
                                )}
                            </div>
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {(submitted || question.showAnswer) && question.explanation && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                    <h3 className="font-semibold mb-2">Explanation</h3>
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}

                {!submitted && (
                  <div className="mt-4 flex justify-start">
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedOption === null || submitLoading}
                      size="sm"
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
                  </div>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-600">
                This question doesn&apos;t have multiple-choice options yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Question Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Question Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-gray-700">
            <div>
              <span className="font-medium">Topic:</span> <span>Frontend</span>
            </div>
            <div>
              <span className="font-medium">Difficulty:</span>{" "}
              <span>{question.difficulty}</span>
            </div>
            <div>
              <span className="font-medium">Time:</span>{" "}
              <span>{question.duration} minutes</span>
            </div>
            {question.source && (
              <div>
                <span className="font-medium">Asked at:</span>{" "}
                <span>{question.source}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
