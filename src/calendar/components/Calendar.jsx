import React, { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import ReactCalendar from "react-calendar";
import ChevronLeft from "../../components/icons/ChevronLeft";
import ChevronRight from "../../components/icons/ChevronRight";
import { useCalendarData } from "../../services/calendar";

const MOUNT_POINT = window.ihandout_config["mount-point"];

const Comment = styled.span`
  .md-typeset && {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
    flex-grow: 1;
  }
`;

const BadgeList = styled.ul`
  .md-typeset && {
    width: 100%;
    margin-left: 0;
    list-style-type: none;
  }
`;

const Badge = styled.li`
  .md-typeset && {
    margin: 0 0 0.2rem;
    overflow: hidden;
    border-radius: 1rem;
    background-color: ${(props) => props.dtype?.color?.default};
    padding: 0.3rem 0.05rem;

    :hover {
      background-color: ${(props) => props.dtype?.color?.hover};
    }

    span,
    a {
      color: ${(props) => props.dtype?.textColor};
    }
  }
`;

const LegendContainer = styled.ul`
  .md-typeset && {
    margin: 0;
    padding: 0.2rem 0;
    list-style-type: none;
  }
`;

const LegendTitle = styled.label`
  display: block;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 1rem 0 0.2rem;
`;

const LegendItem = styled.li`
  .md-typeset && {
    margin-left: 0;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    line-height: 1;
  }

  :before {
    display: inline-block;
    width: 1rem;
    height: 1rem;
    content: "";
    background-color: ${(props) => props.color};
    margin-right: 0.4rem;
  }
`;

function formatDate(date) {
  return date.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}

function makeTileContent(data) {
  return function ({ date, view }) {
    if (view !== "month" || !data) {
      return "";
    }

    const dayData = data.calendar[formatDate(date)];

    if (!dayData) {
      return "";
    }
    const { badges, comment } = dayData;

    return (
      <>
        {!!badges?.length && (
          <BadgeList>
            {badges.map((badge) => {
              const label = badge.label;
              const uri = badge.uri;
              const dtype = data.dtypes[badge.dtype];

              return (
                <Badge dtype={dtype} key={`badge__${label}`}>
                  {!uri && <span>{label}</span>}
                  {!!uri && <a href={MOUNT_POINT + `${uri}`}>{label}</a>}
                </Badge>
              );
            })}
          </BadgeList>
        )}
        {comment && <Comment>{comment}</Comment>}
      </>
    );
  };
}

function makeTileDisabled(data) {
  return function ({ activeStartDate, date, view }) {
    if (view !== "month" || !data) {
      return false;
    }

    const dayData = data.calendar[formatDate(date)];
    const isClassDay = data.classDays.indexOf(date.getDay()) >= 0;
    if (dayData) {
      return dayData.disabled;
    }
    return !isClassDay;
  };
}

function Legend({ label, color }) {
  return <LegendItem color={color}>{label}</LegendItem>;
}

export default function Calendar() {
  const data = useCalendarData();
  const now = new Date();

  const tileContent = useMemo(() => {
    return makeTileContent(data);
  }, [data]);
  const tileDisabled = useMemo(() => {
    return makeTileDisabled(data);
  }, [data]);

  const legendData = useMemo(() => {
    if (!data?.dtypes) return [];

    const dtypes = Object.values(data.dtypes);
    return dtypes.map((meta) => [meta.title, meta.color.default]);
  }, [data]);

  if (!data) {
    return null;
  }
  return (
    <div>
      <ReactCalendar
        defaultActiveStartDate={data.start}
        prevLabel={<ChevronLeft />}
        nextLabel={<ChevronRight />}
        prev2Label={null}
        next2Label={null}
        locale="pt-BR"
        formatMonthYear={(locale, date) => {
          const localized = date.toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
          });
          return localized.charAt(0).toUpperCase() + localized.slice(1);
        }}
        value={now}
        tileContent={tileContent}
        tileDisabled={tileDisabled}
        minDetail="month"
      />
      <LegendTitle>Legenda:</LegendTitle>
      <LegendContainer>
        {legendData.map(([label, color]) => (
          <Legend key={label} label={label} color={color} />
        ))}
      </LegendContainer>
    </div>
  );
}
