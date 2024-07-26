"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { useState } from "react";
import BluePrintForm from "./form";

import { DataTable } from '@/components/tables/data-table'
import { columns } from './columns'
import { BluePrint } from "@prisma/client";

const BluePrintClient = ({bluePrintData}:{bluePrintData:BluePrint[]}) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
 <DataTable
        columns={columns}
        data={bluePrintData}
        striped
        
        headers
        placeHolder="Search"
        paginationType="simple"
        topMenu={ <Button onClick={()=>setIsOpen(true)}>Open Form</Button>}
      
      />

   
      <Dialog onOpenChange={setIsOpen} open={isOpen}>
        <DialogContent>

            {/* <b><h3> Input Details</h3></b> */}
            <h3 className="text-2xl font-semibold py-2">Input Details</h3>
           <BluePrintForm onClose={()=>setIsOpen(false)}/>


           
        </DialogContent>
      </Dialog>
      
    </>
  );
};

export default BluePrintClient;
