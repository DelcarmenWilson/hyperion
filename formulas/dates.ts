import moment from "moment";

export function getAge (dateOfBirth: any){
    return moment().diff(dateOfBirth, "years");
}