import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { registerAnswer, renderExercise } from "./utils";
import { SubmitButton } from "./components/SubmitButton";
import ChevronLeft from "../components/icons/ChevronLeft";
import ChevronRight from "../components/icons/ChevronRight";

export const SubmitBundleContainer = styled.div`
  display: flex;
  width: 3.0rem;
  height: 3.0rem;
  justify-content: flex-end;
`;

const ChoiceLabel = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1.5rem;
`;


function searchExerciseShow(exercises) {
  let index = 0;
  for (const exercise of exercises) {
    if (!exercise.classList.contains('hidden')) {
        return(index)
    } else {
      index++;
    }
  }
}

function changeIndex(bundleContainer, inc) {
  const bundleExercises = bundleContainer.querySelectorAll(".admonition.exercise");
  const indexCur = searchExerciseShow(bundleExercises);
  const indexMax = bundleExercises.length - 1;
  const indexNew = indexCur + inc;
  if (indexNew < 0 || indexNew > indexMax)
    return 0

  bundleExercises[indexCur].classList.add("hidden");
  bundleExercises[indexNew].classList.remove("hidden");

}

function BundleAction({ bundleContainer, answer, previouslyAnswered, submit }) {
  const [answered, setAnswered] = useState(previouslyAnswered);

  const handleClickPrevious = useCallback(() => {
    setAnswered(false);
    changeIndex(bundleContainer, -1);
    submit();
  }, [setAnswered, submit]);

  const handleClickNext = useCallback(() => {
    setAnswered(false);
    changeIndex(bundleContainer, 1);
    submit();
  }, [setAnswered, submit]);

  return (
    <SubmitBundleContainer>
      <SubmitButton onClick={handleClickPrevious} disabled={answered}>
        <ChevronLeft />
      </SubmitButton>
      <SubmitButton onClick={handleClickNext} disabled={answered}>
        <ChevronRight />
      </SubmitButton>
    </SubmitBundleContainer>
  );
}

export function renderBundle(
  bundleContainer,
  { previousAnswer },
  answerData
) {

  const title = bundleContainer.getElementsByClassName('admonition-title')[0]
  title.remove();

  const submit = () =>
    registerAnswer(
      bundleContainer,
      1,
      {
        done: "true",
      },
      {},
      "true"
    );

  renderExercise(
    <BundleAction
      bundleContainer={bundleContainer}
      answer={answerData}
      previouslyAnswered={!!previousAnswer}
      submit={submit}
    />,
    bundleContainer,
  );
}
