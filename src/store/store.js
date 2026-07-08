import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Reducer/AuthSlice";
import emergencyReducer from "../Reducer/EmergencySlice";
import medicineReducer from "../Reducer/MedicineSlice";
import notificationReducer from "../Reducer/NotificationSlice";
import pharmacyReducer from "../Reducer/PharmacySlice";
import reservationReducer from "../Reducer/ReservationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    emergency: emergencyReducer,
    medicine: medicineReducer,
    notification: notificationReducer,
    pharmacy: pharmacyReducer,
    reservation: reservationReducer,
  },
});
