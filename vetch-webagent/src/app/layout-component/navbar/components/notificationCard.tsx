import { NotificationService } from "@/lib/services/NotificationService";
import { formatIsoJakarta } from "@/lib/utils/formatDate";
import { CircleCheckBig } from "lucide-react";
import React from "react";

const NotificationCard = ({ notification, onAction }) => {
  const notificationService = new NotificationService();
  const handleConfirm = async()=>{
    try {
        const res = await notificationService.confirmNotification(notification.id);
        console.log(res);
        if(res.ok){
            // remove notification from list
            onAction();
        }
    } catch (error) {
        console.log(error);
    }
  }

  return (
    <>
      <div className="sm:min-w-[200px] max-w-[90vw] flex flex-row justify-between gap-3 p-3 items-center">
        <div className="flex flex-col w-fit">
          <span className="font-semibold sm:text-lg text-sm text-wrap w-fit">{notification.message}</span>
          <span className="font-thin sm:text-sm text-xs w-fit">{formatIsoJakarta(notification.createdAt)}</span>
        </div>
        <div>
          <button className="text-green-500 hover:text-white duration-200 transition-all" onClick={handleConfirm} title="Mark as read">
            <CircleCheckBig className="w-6 h-6 " />
          </button>
        </div>
      </div>
      <div className="w-full h-[0.5px] bg-gray-300/50"></div>
    </>
  );
};

export default NotificationCard;
