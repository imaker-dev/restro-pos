import Api from '../api.js';

export default false
    ? {
        message: "You are Offline. Please turn on the internet",
    }
    : {
        getAllShiftHistoryApi: (outletId) => {
            return Api.get(`/orders/shifts/${outletId}/history`);
        },
        getShiftSummaryApi:(outletId) => {
            return Api.get(`/orders/shifts/${outletId}/summary`)
        },
        getShiftHistoryByIdApi:(shiftId) => {
            return Api.get(`/orders/shifts/${shiftId}/detail`)
        }
    };
