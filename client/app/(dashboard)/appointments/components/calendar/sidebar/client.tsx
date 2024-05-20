import React from "react";
import CreateEventButton from "./create-event-button";
import SmallCalendar from "./small-calendar";
import Labels from "./labels";

export const SidebarClient = () => {
  return (
    <aside className="border p-5 w-64">
      <CreateEventButton />
      <SmallCalendar />
      <Labels />
    </aside>
  );
};
