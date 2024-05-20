import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useAppointmentContext } from "@/providers/app";
import { BookMarked, Calendar, Check, Plus, Trash, X } from "lucide-react";

const labelsClasses = ["indigo", "gray", "green", "blue", "red", "purple"];

export const AppointmentModal = () => {
  const {
    setShowAppointmentModal,
    daySelected,
    dispatchCalAppointment,
    selectedAppointment,
  } = useAppointmentContext();

  const [title, setTitle] = useState(
    selectedAppointment ? selectedAppointment.title : ""
  );
  const [description, setDescription] = useState(
    selectedAppointment ? selectedAppointment.comments : ""
  );
  const [selectedLabel, setSelectedLabel] = useState(
    selectedAppointment
      ? labelsClasses.find((lbl) => lbl === selectedAppointment.label)
      : labelsClasses[0]
  );

  function handleSubmit(e: any) {
    e.preventDefault();
    const calendarEvent = {
      title,
      description,
      label: selectedLabel as string,
      startDate: new Date(daySelected?.toDate()!),
      endDate: new Date(),
      status: "scheduled",
      comments: "",
      agentId: "",
      id: selectedAppointment ? selectedAppointment.id : "",
      leadId: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (selectedAppointment) {
      dispatchCalAppointment({
        type: "update_appointment",
        payload: calendarEvent,
      });
    } else {
      dispatchCalAppointment({
        type: "insert_appointment",
        payload: calendarEvent,
      });
    }

    setShowAppointmentModal(false);
  }
  return (
    <div className="flex-center absolute inset-0">
      <div className="flex-center h-[300px] w-full">
        <form className="bg-background rounded-lg shadow-2xl w-1/4">
          <header className="flex bg-secondary p-2  justify-between items-center">
            <Plus size={16} />
            <div className="flex items-center gap-2">
              {selectedAppointment && (
                <span
                  onClick={() => {
                    dispatchCalAppointment({
                      type: "delete_appointment",
                      payload: selectedAppointment.id,
                    });
                    setShowAppointmentModal(false);
                  }}
                  className="material-icons-outlined text-gray-400 cursor-pointer"
                >
                  <Trash size={16} />
                </span>
              )}
              <Button onClick={() => setShowAppointmentModal(false)}>
                <X size={16} />
              </Button>
            </div>
          </header>
          <div className="p-3">
            <div className="grid grid-cols-1/5 items-center gap-2 space-y-2">
              <Input
                type="text"
                name="title"
                className="col-span-2"
                placeholder="Add title"
                value={title as string}
                required
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="material-icons-outlined text-gray-400">
                <Calendar size={16} />
              </span>
              <p>{daySelected?.format("dddd, MMMM DD")}</p>
              <span className="material-icons-outlined text-gray-400">
                <Calendar size={16} />
              </span>
              <Input
                type="text"
                name="description"
                placeholder="Add a description"
                value={description as string}
                required
                onChange={(e) => setDescription(e.target.value)}
              />
              <span className="material-icons-outlined text-gray-400">
                <BookMarked size={16} />
              </span>
              <div className="flex gap-x-2">
                {labelsClasses.map((lblClass, i) => (
                  <span
                    key={i}
                    onClick={() => setSelectedLabel(lblClass)}
                    className={`bg-${lblClass}-500 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer`}
                  >
                    {selectedLabel === lblClass && (
                      <span className="material-icons-outlined text-white text-sm">
                        <Check size={16} />
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <footer className="flex justify-end border-t p-3 mt-5">
            <Button
              type="submit"
              variant="outlineprimary"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </footer>
        </form>
      </div>
    </div>
  );
};
