import React from "react";
import dayjs from "dayjs";
import { Day } from "./day";
export const Month = ({ month }: { month: dayjs.Dayjs[][] }) => {
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <div className="grid grid-cols-7 grid-rows-5 min-h-full overflow-hidden">
        {month.map((row, i) => (
          <>
            {row.map((day, idx) => (
              <Day day={day} key={idx} rowIdx={i} />
            ))}
          </>
        ))}
      </div>
    </div>
  );
};
