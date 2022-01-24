import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import { useQuery, useQueryClient } from "react-query";
import { fetchAnswerSummaries } from "./services";
import { ANSWER_SUBMITTED } from "../../events";
import { ExerciseType, computePoints } from "../../utils";
import CircularProgressBar from "../../../components/CircularProgressBar";

const ProgressContainer = styled.div`
  position: sticky;
  top: 2.4rem;
  width: 10rem;
  padding: 1.2rem 1rem;
  margin: 0 0.2rem 0 1rem;
  align-self: flex-start;
  flex-shrink: 0;

  @media screen and (max-width: 76.1875em) {
    display: none;
  }

  label {
    display: block;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
`;

export function HandoutProgress({ exerciseSlugs }) {
  const queryClient = useQueryClient();
  const { data: summariesBySlug } = useQuery("/summaries/", () =>
    fetchAnswerSummaries(exerciseSlugs)
  );

  const handleAnswerSubmitted = useCallback(() => {
    queryClient.invalidateQueries("/summaries/");
  }, [queryClient]);

  useEffect(() => {
    window.addEventListener(ANSWER_SUBMITTED, handleAnswerSubmitted);
    return () => {
      window.removeEventListener(ANSWER_SUBMITTED, handleAnswerSubmitted);
    };
  }, []);

  const [points, setPoints] = useState(0);
  const total = exerciseSlugs.length;
  useEffect(() => {
    if (!exerciseSlugs || !summariesBySlug) {
      return;
    }
    setPoints(computePoints(exerciseSlugs, summariesBySlug));
  }, [exerciseSlugs, summariesBySlug]);

  return (
    <ProgressContainer>
      <label>Progresso</label>
      <CircularProgressBar current={points} total={total} />
    </ProgressContainer>
  );
}
