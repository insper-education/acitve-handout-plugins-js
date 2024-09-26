import { renderCodeExercise } from "./code-exercise";
import { renderCSSExercise } from "./css-exercises";
import { renderHandoutProgress } from "./handout-progress";
import { renderMultipleChoiceExercise } from "./multiple-choice";
import { renderSelfAssessedExercise } from "./self-assessed-exercise";
import { renderTextExercise } from "./text-question";
import { renderBundle } from "./bundle";
import {
  ExerciseType,
  extractAnswerData,
  getExerciseType,
  initExercise,
} from "./utils";

function renderExercise (exerciseContainer, renderFunctions){
};

{

  const exercises = document.querySelectorAll(".admonition.exercise");
  const bundles = document.querySelectorAll(".admonition.bundle");

  if (exercises.length) {
    const slugs = [...exercises].map((admonition) => admonition.id);
    const mainContainer = document.querySelector(".md-sidebar__inner");
    renderHandoutProgress(mainContainer, slugs);
  }

  const renderFunctions = {
    [ExerciseType.TEXT]: renderTextExercise,
    [ExerciseType.CHOICE]: renderMultipleChoiceExercise,
    [ExerciseType.CSS]: renderCSSExercise,
    [ExerciseType.CODE]: renderCodeExercise,
    [ExerciseType.SELF]: renderSelfAssessedExercise,
    [ExerciseType.BUNDLE]: renderBundle,
  };

  exercises.forEach((exerciseContainer) => {
    const isBundle = exerciseContainer.classList.contains("bundle");
    const show = !exerciseContainer.parentNode.classList.contains("bundle");
    let answerData = ''
    let exerciseData = ''

    if (!isBundle) {
      answerData = extractAnswerData(exerciseContainer);
      exerciseData = initExercise(exerciseContainer);
    }

    const render = renderFunctions[getExerciseType(exerciseContainer)];
    render(exerciseContainer, exerciseData, answerData, show);
  });

  bundles.forEach((bundleContainer) => {
    const bundleExercises = bundleContainer.querySelectorAll(".admonition.exercise");
    bundleExercises.forEach((exerciseContainer, index) => {
      if (index == 0) {
        exerciseContainer.classList.remove("hidden");
      }
    });
    bundleContainer.classList.remove("hidden");
  });


}
