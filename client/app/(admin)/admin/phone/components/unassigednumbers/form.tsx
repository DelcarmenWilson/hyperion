"use client";
import { usePhoneSetup, usePhoneSetupActions } from "@/hooks/use-phone-setup";

import { Button } from "@/components/ui/button";

import { UserSelect } from "@/components/user/select";
import { TwilioAppSelect } from "@/components/twilio/app-select";

import { CardData } from "@/components/reusable/card-data";
import { CustomDialog } from "@/components/global/custom-dialog";
import { Switch } from "@/components/ui/switch";

import { formatPhoneNumber } from "@/formulas/phones";
import { formatDate } from "@/formulas/dates";

export const AssignNumberForm = () => {
  const { isUnassignedFormOpen, onUnassignedFormClose, phoneNumber } =
    usePhoneSetup();
  const {
    userId,
    setUserId,
    app,
    setApp,
    registered,
    setRegistered,
    loading,
    onAssignNumber,
    onNumberUpdateApp,
  } = usePhoneSetupActions(onUnassignedFormClose, phoneNumber);

  if (!phoneNumber) return;
  return (
    <CustomDialog
      open={isUnassignedFormOpen}
      onClose={onUnassignedFormClose}
      title="Phone Number Details"
      description="Unassigend Numbers Form"
    >
      <h3 className="font-semibold text-primary text-2xl italic text-center">
        {formatPhoneNumber(phoneNumber.phone)}
      </h3>
      <div className="flex justify-between items-center">
        <CardData label="Sid" value={phoneNumber.sid} />
        <div className="flex gap-2">
          <span>Registered</span>
          <Switch checked={registered} onCheckedChange={setRegistered} />
        </div>
      </div>

      <h4 className="font-bold">App</h4>
      <div className="flex gap-2 text-sm my-2">
        <TwilioAppSelect app={app} setApp={setApp} />
        {app && app != phoneNumber.app && (
          <div className="text-end">
            <Button
              className="w-fit"
              disabled={loading}
              onClick={onNumberUpdateApp}
            >
              Update App
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 text-sm">
        <TextGroup label="State" value={phoneNumber.state} />
        <TextGroup
          label="Created At"
          value={formatDate(phoneNumber.createdAt)}
        />
        <TextGroup label="Renew At" value={formatDate(phoneNumber.renewAt)} />
      </div>
      <h4 className="font-bold">Assign/Reassign Number</h4>
      <div className="flex gap-2 text-sm my-2">
        <UserSelect userId={userId} setUserId={setUserId} />
        {userId && userId != phoneNumber.agentId && (
          <div className="text-end">
            <Button
              className="w-fit"
              disabled={loading}
              onClick={onAssignNumber}
            >
              Assign Number
            </Button>
          </div>
        )}
      </div>
    </CustomDialog>
  );
};

type TextGroupProps = {
  label: string;
  value: string;
};

const TextGroup = ({ label, value }: TextGroupProps) => {
  return (
    <div>
      <p className="font-semibold">{label}</p>
      <span>{value}</span>
    </div>
  );
};
