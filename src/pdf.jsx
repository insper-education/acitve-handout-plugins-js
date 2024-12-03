import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";


const PdfWrapper = styled.div`
display: flex;
justify-content: center;
align-items: center;

& > .print-description {
  display: none;
}

@media print {
  & iframe {
    display: none;
  }
  & video {
    display: none;
  }

  & > .print-description {
    display: block;
  }
}
`;


function Pdf({ source }) {

    return (
        <PdfWrapper>
            <embed
                src={source}
                type="application/pdf"
                height={300}
                width="80%"
            />
        </PdfWrapper>
    );
}

{
    const documentPdfTags = document.querySelectorAll('.admonition.pdf');
    documentPdfTags.forEach((div) => {
        const source = div.getElementsByTagName('img')[0];
        const root = document.createElement('div');
        ReactDOM.render(
            <Pdf source={source.src} />,
            root
        );
        div.classList.remove("admonition", "pdf");
        for (const child of div.children) {
            div.removeChild(child);
        }
        div.appendChild(root);
    });
}
