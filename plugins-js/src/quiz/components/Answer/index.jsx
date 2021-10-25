import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const AnswerContainer = styled.div`
  &&& {
    margin: 1.5rem -2rem 0;
    padding: 0.5rem 2rem;
    background-color: #f3f3f3;

    ${({ visible }) => (visible ? "display: inherit;" : "display: none;")}
  }
`;

const AnswerTitle = styled.h4`
  &&& {
    text-transform: uppercase;
  }
`;

function Answer({ data, visible }) {
  return (
    <AnswerContainer visible={visible}>
      <AnswerTitle>{data.title}</AnswerTitle>
      <div dangerouslySetInnerHTML={data.innerHTML} />
    </AnswerContainer>
  );
}

Answer.propTypes = {
  data: PropTypes.object.isRequired,
  visible: PropTypes.bool,
};

Answer.defaultProps = {
  visible: true,
};

export default Answer;
