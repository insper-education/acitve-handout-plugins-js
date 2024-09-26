import React from "react";
import ReactDOM from "react-dom";
import report from "../report.js";
import { makeAnswerSubmittedEvent } from "./events.js";

export function parseAnswer(answerDiv) {
  const titleP = answerDiv.querySelector(".admonition-title");
  const title = titleP?.textContent.trim() || "";
  answerDiv.removeChild(titleP);

  return {
    title,
    innerHTML: { __html: answerDiv.innerHTML },
  };
}

export function initExercise(exerciseContainer) {
  const answerKey = getAnswerKey(exerciseContainer.id);
  const previousAnswer = getPreviousAnswer(exerciseContainer.id);

  const answered = isAnswered(exerciseContainer.id);

  exerciseContainer.dataset.answered = answered;
  if (answered) {
    markAsAnswered(exerciseContainer);
  }

  return { answered, answerKey, previousAnswer };
}

export function markAsAnswered(exerciseContainer) {
  const fullSlug = exerciseContainer.getAttribute("id");
  const answeredKey = `${fullSlug}-answered`;
  localStorage[answeredKey] = "true";

  exerciseContainer.dataset.answered = true;
  exerciseContainer.classList.add("answered");
}

function getAnswerKey(exerciseSlug) {
  const documentAddr = document.location.pathname;
  return documentAddr + "/" + exerciseSlug;
}

export function getPreviousAnswer(exerciseSlug) {
  const answerKey = getAnswerKey(exerciseSlug);
  return localStorage.getItem(answerKey);
}

function getAnsweredKey(exerciseSlug) {
  return `${exerciseSlug}-answered`;
}

export function isAnswered(exerciseSlug) {
  const answeredKey = getAnsweredKey(exerciseSlug);
  const previousAnswer = getPreviousAnswer(exerciseSlug);

  return localStorage.getItem(answeredKey) === "true" || !!previousAnswer;
}

export function setPreviousAnswer(exerciseSlug, answer) {
  localStorage[getAnswerKey(exerciseSlug)] = answer;
}

export function registerAnswer(
  exerciseContainer,
  points,
  testResult,
  studentInput,
  studentAnswer
) {
  const fullSlug = exerciseContainer.getAttribute("id");

  return report
    .sendAnswer(fullSlug, points, testResult, studentInput)
    .finally(() => {
      markAsAnswered(exerciseContainer);
      if (studentAnswer !== undefined) {
        setPreviousAnswer(exerciseContainer.id, studentAnswer);
      }
      window.dispatchEvent(makeAnswerSubmittedEvent(fullSlug, studentAnswer));
    });
}

export function extractAnswerData(exerciseContainer) {
  const answerDiv = exerciseContainer.querySelector(".admonition.answer");
  let answerData = null;
  if (answerDiv) {
    answerData = parseAnswer(answerDiv);
    exerciseContainer.removeChild(answerDiv);
  }
  return answerData;
}

export function renderExercise(element, container, replacement, show) {
  const root = document.createElement("div");
  ReactDOM.render(element, root);

  if (replacement) {
    container.replaceChild(root, replacement);
  } else {
    container.appendChild(root);
  }

  if (show) {
    showExercise(container);
  }
}

export function showExercise(exerciseContainer) {
  exerciseContainer.classList.remove("hidden");
}

export const ExerciseType = {
  TEXT: "text",
  CHOICE: "choice",
  CSS: "css",
  CODE: "code",
  SELF: "self-assessed",
  BUNDLE: "bundle",
};

export function getExerciseType(exerciseContainer) {
  const classes = exerciseContainer.classList;
  if (classes.contains("short") || classes.contains("long")) {
    return ExerciseType.TEXT;
  } else if (classes.contains("choice")) {
    return ExerciseType.CHOICE;
  } else if (classes.contains("css-exercise")) {
    return ExerciseType.CSS;
  } else if (classes.contains("code-exercise")) {
    return ExerciseType.CODE;
  } else if (classes.contains("bundle")) {
    return ExerciseType.BUNDLE;
  } else {
    return ExerciseType.SELF;
  }
}

export function pointsFromSummary(summary) {
  if (!summary) {
    return 0;
  }
  const exerciseType = summary.exercise_type;
  if (exerciseType === ExerciseType.CODE || exerciseType === ExerciseType.CSS) {
    return summary.max_points;
  }
  return summary.answer_count > 0;
}

export function computePoints(exerciseSlugs, summariesBySlug) {
  if (!summariesBySlug) return 0;
  const summaries = exerciseSlugs
    .map((slug) => summariesBySlug.get(slug))
    .filter((s) => !!s);
  return summaries.map(pointsFromSummary).reduce((a, b) => a + b, 0);
}
